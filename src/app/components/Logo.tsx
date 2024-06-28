import Link from "next/link";
import styles from "./header.module.css";

export default function Logo() {
  return (
    <header>
      <div className={styles.logo}>
        <Link className={styles.logoText} href="/">
          &darr; Follow the Crypto &darr;
        </Link>
      </div>
    </header>
  );
}
