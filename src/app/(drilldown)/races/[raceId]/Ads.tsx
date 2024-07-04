import { fetchAdsByRace, fetchConstant } from "@/app/actions/fetch";
import OverflowSection from "@/app/components/OverflowSection";
import { Ad } from "@/app/types/Ads";
import { CommitteeConstant } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import GoogleAd from "./GoogleAd";
import ImageAd from "./ImageAd";

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
    <OverflowSection>
      {ads.map((ad) => {
        if (ad.type === "google") {
          return <GoogleAd ad={ad} committees={committees} key={ad.ad_id} />;
        }
        return <ImageAd ad={ad} committees={committees} key={ad.src} />;
      })}
    </OverflowSection>
  );
}
