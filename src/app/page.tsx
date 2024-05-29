import { Suspense } from "react";
import TotalSpending from "./components/TotalSpending";
import MapWrapper from "./components/home/MapWrapper";
import USMapSkeleton from "./components/skeletons/USMapSkeleton";
import styles from "./page.module.css";
import sharedStyles from "./shared.module.css";

export default function Home() {
  return (
    <main className={sharedStyles.mainGrid}>
      <h1 className={sharedStyles.title}>
        Follow the crypto
        <br />
        &darr;
      </h1>
      <TotalSpending amount="$120 million" />
      <div className={styles.mapContainer}>
        <Suspense fallback={<USMapSkeleton />}>
          <MapWrapper />
        </Suspense>
      </div>
    </main>
  );
}
