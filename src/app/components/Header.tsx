import Link from "next/link";
import { Suspense } from "react";
import HeaderNavLinks from "./HeaderNavLinks";
import Logo from "./Logo";
import SectorWrapper from "./SectorWrapper";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.topbar}>
        <div className={styles.topbarContents}>
          <span className={styles.topbarLogo}>[citation needed]</span>
          <Link href="/support" className={styles.topbarLink}>
            Support
          </Link>
        </div>
      </div>
      <div className={styles.logoAndNav}>
        <Link href="/" className={styles.logoLink}>
          <Logo />
        </Link>
        <Suspense fallback={null}>
          <HeaderNavLinks />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <SectorWrapper />
      </Suspense>
    </header>
  );
}
