import { Suspense } from "react";
import { MoneyCardSkeleton } from "./components/MoneyCard";
import { InfluencedRaces } from "./components/home/InfluencedRaces";
import { InfluencedRacesTableContents } from "./components/home/InfluencedRacesTableContents";
import MapWrapper from "./components/home/MapWrapper";
import SuperPACsByReceipts from "./components/home/SuperPACsByReceipts";
import SuperPACsByReceiptsTableContents from "./components/home/SuperPACsByReceiptsTableContents";
import TotalDisbursements from "./components/home/TotalDisbursements";
import TotalRaised from "./components/home/TotalRaised";
import USMapSkeleton from "./components/skeletons/USMapSkeleton";
import styles from "./page.module.css";
import sharedStyles from "./shared.module.css";

export default function Home() {
  return (
    <main className={sharedStyles.mainGrid}>
      <div className={styles.titleWrapper}>
        <span className={styles.logoArrow}>&darr;</span>
        <h1 className={styles.title}>Follow the crypto</h1>
        <span className={styles.logoArrow}>&darr;</span>
      </div>
      <Suspense fallback={<MoneyCardSkeleton className={styles.raisedCard} />}>
        <TotalRaised className={styles.raisedCard} />
      </Suspense>
      <Suspense fallback={<MoneyCardSkeleton className={styles.spentCard} />}>
        <TotalDisbursements className={styles.spentCard} />
      </Suspense>
      <SuperPACsByReceipts>
        <SuperPACsByReceiptsTableContents />
      </SuperPACsByReceipts>
      <InfluencedRaces>
        <InfluencedRacesTableContents />
      </InfluencedRaces>
      <div className={styles.mapContainer}>
        <Suspense fallback={<USMapSkeleton />}>
          <MapWrapper />
        </Suspense>
      </div>
    </main>
  );
}
