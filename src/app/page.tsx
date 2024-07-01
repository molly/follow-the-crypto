import { Suspense } from "react";
import InfluencedRaces from "./components/InfluencedRaces";
import InfluencedRacesTableContents from "./components/InfluencedRacesTableContents";
import { MoneyCardSkeleton } from "./components/MoneyCard";
import SuperPACsByReceipts from "./components/PACsByReceipts";
import SuperPACsByReceiptsTableContents from "./components/SuperPACsByReceiptsTableContents";
import AllExpendituresByParty from "./components/home/AllExpendituresByParty";
import AllRecentExpenditures from "./components/home/AllRecentExpenditures";
import MapWrapper from "./components/home/MapWrapper";
import TotalDisbursements from "./components/home/TotalDisbursements";
import TotalRaised from "./components/home/TotalRaised";
import USMapSkeleton from "./components/skeletons/USMapSkeleton";
import styles from "./page.module.css";
import sharedStyles from "./shared.module.css";

export default function Home() {
  return (
    <main className={sharedStyles.mainLayout}>
      <div className={styles.titleWrapper}>
        <span className={styles.logoArrow}>&darr;</span>
        <h1 className={styles.title}>Follow the crypto</h1>
        <span className={styles.logoArrow}>&darr;</span>
      </div>
      <div className={styles.totalsRow}>
        <Suspense
          fallback={<MoneyCardSkeleton className={styles.raisedCard} />}
        >
          <TotalRaised className={styles.raisedCard} />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton className={styles.spentCard} />}>
          <TotalDisbursements className={styles.spentCard} />
        </Suspense>
      </div>
      <div className={styles.mainCards}>
        <AllExpendituresByParty />
        <InfluencedRaces>
          <InfluencedRacesTableContents />
        </InfluencedRaces>
        <SuperPACsByReceipts type="super">
          <SuperPACsByReceiptsTableContents />
        </SuperPACsByReceipts>
        <AllRecentExpenditures />
      </div>
      <div className={styles.mapContainer}>
        <Suspense fallback={<USMapSkeleton />}>
          <MapWrapper />
        </Suspense>
      </div>
    </main>
  );
}
