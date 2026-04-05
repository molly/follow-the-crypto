import styles from "./header.module.css";

export default function Logo() {
  return (
    <div className={styles.title}>
      <h1 className={styles.titleH1}>
        Tech Influence <span className={styles.titleWatch}>Watch</span>
      </h1>
    </div>
  );
}
