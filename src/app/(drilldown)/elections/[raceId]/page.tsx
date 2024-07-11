import { STATES_BY_ABBR } from "@/app/data/states";
import { getRaceName } from "@/app/utils/races";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Ads from "./Ads";
import Elections, { ElectionsSkeleton } from "./Elections";
import { SpendingSkeleton } from "./Spending";
import SpendingCard from "./SpendingCard";
import styles from "./page.module.css";

export function generateMetadata({
  params,
}: {
  params: { raceId: string };
}): Metadata {
  const state = params.raceId.split("-")[0];
  const raceName = `${STATES_BY_ABBR[state]} ${getRaceName(params.raceId)}`;
  return {
    title: `${raceName} election | Follow the Crypto`,
    description: `Cryptocurrency industry spending to influence the ${raceName} election.`,
  };
}

export default function RacePage({ params }: { params: { raceId: string } }) {
  const raceIdSplit = params.raceId.split("-");
  const stateAbbr = raceIdSplit[0];

  return (
    <>
      <div className={styles.columns}>
        <div className={styles.headerWrapper}>
          <h1 className="margin-0">{`${STATES_BY_ABBR[stateAbbr]} ${getRaceName(params.raceId)} election`}</h1>
        </div>
        <div className={styles.electionsColumn}>
          <h2 className={styles.electionsColumnHeader}>Elections</h2>
          <Suspense fallback={<ElectionsSkeleton />}>
            <Elections raceId={params.raceId} />
          </Suspense>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.spendingCard}>
            <h2 id="spending-label">Spending</h2>
            <Suspense fallback={<SpendingSkeleton />}>
              <SpendingCard raceId={params.raceId} />
            </Suspense>
          </div>
          <div className={styles.adsCard}>
            <h2 className="no-margin">Ads</h2>
            <Ads raceId={params.raceId} />
            <div className="small">
              These are mostly tracked by hand, and so some advertisements may
              be missing. Have you seen a cryptocurrency PAC-funded
              advertisement pertaining to this election?{" "}
              <Link href="/contribute/ad">Send it in!</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
