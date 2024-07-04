import Link from "next/link";
import styles from "./header.module.css";

export default function Logo() {
  return (
    <header>
      <div className={styles.logo}>
        <Link className={styles.logoText} href="/">
          <span aria-hidden={true}>&darr;</span> Follow the Crypto{" "}
          <span aria-hidden={true}>&darr;</span>
        </Link>
      </div>
    </header>
  );
}
