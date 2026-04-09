import Link from "next/link";
import { Suspense } from "react";
import HeaderNavLinks from "./HeaderNavLinks";
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
        <Suspense fallback={null}>
          <HeaderNavLinks />
        </Suspense>
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
