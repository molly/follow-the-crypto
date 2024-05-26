import TotalSpending from "./components/TotalSpending";
import MapWrapper from "./components/home/MapWrapper";
import styles from "./page.module.css";
import sharedStyles from "./shared.module.css";

export const revalidate = 3600;

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
        <MapWrapper />
      </div>
    </main>
  );
}
