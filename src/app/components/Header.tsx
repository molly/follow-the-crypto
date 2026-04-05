import Link from "next/link";
import { Suspense } from "react";
import Logo from "./Logo";
import SectorButtons from "./SectorButtons";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.logoAndNav}>
        <Link href="/" className={styles.logoLink}>
          <Logo />
        </Link>
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <div className={styles.navItem}>
              <a href="#">Spending</a>
              <div className={styles.dropdown}>
                <Link href="/2026/committees">By committees</Link>
                <Link href="/2026/companies">By companies</Link>
                <Link href="/2026/individuals">By individuals</Link>
                <Link href="/2026/expenditures">Recent expenditures</Link>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">Elections</a>
              <div className={styles.dropdown}>
                <Link href="/2026/states">By state</Link>
                <Link href="/2026/elections">All elections</Link>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">Rankings</a>
              <div className={styles.dropdown}>
                <Link href="/2026/committees/ranking/super">Super PACs</Link>
                <Link href="/2026/committees/ranking/all">All committees</Link>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">Influence</a>
              <div className={styles.dropdown}>
                <Link href="/2026/quidproquo">Quid pro quo</Link>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">About</a>
              <div className={styles.dropdown}>
                <Link href="/about">About</Link>
                <Link href="/about/faq">FAQ</Link>
                <Link href="/about/contact">Contact</Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className={styles.sectorWrapper}>
        <div className={styles.sectorContents}>
          Showing:
          <Suspense fallback={null}>
            <SectorButtons />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
