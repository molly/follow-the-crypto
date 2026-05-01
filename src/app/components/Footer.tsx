import Link from "next/link";
import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContents}>
        <p className={styles.description}>
          Tech Influence Watch is a project of{" "}
          <a href="https://www.citationneeded.news">Citation Needed</a>, an
          independent newsletter by{" "}
          <a href="https://www.mollywhite.net">Molly White</a>. Data is sourced
          from FEC filings.
        </p>
        <p className={styles.links}>
          <Link href="/about">About this project</Link>
          <span className={styles.separator}>·</span>
          <Link href="/about/contact">Contact</Link>
        </p>
      </div>
    </footer>
  );
}
