import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
     <h1 className={styles.title}>Follow the crypto<br/>&darr;</h1>
     <div className={styles.subtitle}>Cryptocurrency companies and associated people have spent <div className={styles.highlight}>$xxx</div> to influence 2024 elections.</div>
     <div className={styles.map}>big fuckin map</div>
     <div>Table goes here ig</div>
    </main>
  );
}
