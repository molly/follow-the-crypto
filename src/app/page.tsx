import { Suspense } from "react";
import { MoneyCardSkeleton } from "./components/MoneyCard";
import MapWrapper from "./components/home/MapWrapper";
import SuperPACsByReceipts from "./components/home/SuperPACsByReceipts";
import TotalDisbursements from "./components/home/TotalDisbursements";
import TotalRaised from "./components/home/TotalRaised";
import USMapSkeleton from "./components/skeletons/USMapSkeleton";
import styles from "./page.module.css";
import sharedStyles from "./shared.module.css";

export default function Home() {
  return (
    <main className={sharedStyles.mainGrid}>
      <h1 className={sharedStyles.title}>&darr; Follow the crypto &darr;</h1>
      <Suspense fallback={<MoneyCardSkeleton className={styles.raisedCard} />}>
        <TotalRaised className={styles.raisedCard} />
      </Suspense>
      <Suspense fallback={<MoneyCardSkeleton className={styles.spentCard} />}>
        <TotalDisbursements className={styles.spentCard} />
      </Suspense>
      <SuperPACsByReceipts />
      <div className={styles.mapContainer}>
        <Suspense fallback={<USMapSkeleton />}>
          <MapWrapper />
        </Suspense>
      </div>
    </main>
  );
}
