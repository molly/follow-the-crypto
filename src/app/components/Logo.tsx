import Link from "next/link";
import styles from "./header.module.css";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={`${styles.logo} ${className ? className : ""}`}>
      <Link className={styles.logoText} href="/">
        <span aria-hidden={true}>&darr;</span> Follow the Crypto{" "}
        <span aria-hidden={true}>&darr;</span>
      </Link>
    </div>
  );
}
