import { fetchAdsByRace, fetchConstant } from "@/app/actions/fetch";
import { Ad } from "@/app/types/Ads";
import { CommitteeConstant } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { humanizeApproximateRounded } from "@/app/utils/humanize";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

function formatImpressions(impressions: string) {
  const [lower, upper] = impressions.split("-");
  return `${humanizeApproximateRounded(parseInt(lower))} – ${humanizeApproximateRounded(parseInt(upper))}`;
}

function Embed({ url }: { url: string }) {
  if (url === "TAKEDOWN") {
    return (
      <div className={styles.adTakedown}>
        <div className={styles.adTakedownWarning}>⚠</div>
        <span>
          This ad was taken down by Google for violations of their{" "}
          <a href="https://support.google.com/adspolicy/answer/6008942">
            advertising policies
          </a>
          .
        </span>
      </div>
    );
  }
  const videoId = url.split("v=")[1];
  return (
    <iframe
      className={styles.adEmbed}
      width="560"
      height="315"
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
}

export default async function Ads({ raceId }: { raceId: string }) {
  const [adsData, committeeConstantData] = await Promise.all([
    fetchAdsByRace(raceId),
    fetchConstant("committees"),
  ]);

  if (isError(adsData)) {
    return <div>Something went wrong when fetching ads.</div>;
  }

  const ads = adsData as Ad[];
  const committees = committeeConstantData as Record<string, CommitteeConstant>;

  if (ads.length === 0) {
    return <div>No known ads.</div>;
  }
  return (
    <>
      {ads.map((ad) => {
        const name =
          ad.fec_id in committees ? committees[ad.fec_id].name : ad.fec_id;

        let cost;
        if (ad.spend_usd) {
          cost = `${ad.spend_usd}`;
        } else if (ad.spend_range_min_usd && ad.spend_range_max_usd) {
          cost = `${formatCurrency(ad.spend_range_min_usd, true)} – ${formatCurrency(
            ad.spend_range_max_usd,
            true,
          )}`;
        } else if (ad.spend_range_min_usd) {
          cost = `More than ${formatCurrency(ad.spend_range_min_usd, true)}`;
        } else if (ad.spend_range_max_usd) {
          cost = `Up to ${formatCurrency(ad.spend_range_max_usd, true)}`;
        }
        return (
          <div key={ad.ad_id} className={styles.adGroup}>
            <h3 className="no-margin">
              <Link href={`/committees/${ad.fec_id}`}>{name}</Link>
            </h3>
            <div>
              {ad.date_range_start && ad.date_range_end && (
                <div>
                  <b>Shown:</b> {formatDateFromString(ad.date_range_start)}{" "}
                  &ndash; {formatDateFromString(ad.date_range_end)}
                </div>
              )}
              {ad.videoUrl && <Embed url={ad.videoUrl} />}
              <div>
                {cost && (
                  <span className={styles.adDetails}>
                    <b>Cost to run:</b> {cost}
                  </span>
                )}
                {ad.impressions && (
                  <span className={styles.adDetails}>
                    <b>Impressions:</b> {formatImpressions(ad.impressions)}
                  </span>
                )}
              </div>
              <a href={ad.ad_url}>
                <span>
                  More details in Google&rsquo;s Ad Transparency Center
                </span>
              </a>
            </div>
          </div>
        );
      })}
    </>
  );
}
