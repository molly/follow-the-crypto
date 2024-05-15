import ChloroplethMap from "./components/home/ChloroplethMap";
import styles from "./page.module.css";

export const revalidate = 3600;

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Follow the crypto
        <br />
        &darr;
      </h1>
      <div className={styles.totalSpending}>
        Cryptocurrency companies and associated people have spent{" "}
        <div className={styles.highlight}>$102 million</div> to influence 2024
        elections.
      </div>
      <div className={styles.mapContainer}>
        <ChloroplethMap />
      </div>
    </main>
  );
}
