import { Suspense } from "react";
import Logo from "./Logo";
import SectorButtons from "./SectorButtons";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.headerWrapper}>
      <div className={styles.logoAndNav}>
        <Logo />
        <nav className={styles.nav}>
          <div className={styles.navLinks}>
            <div className={styles.navItem}>
              <a href="#">Spending</a>
              <div className={styles.dropdown}>
                <a href="#">By committees</a>
                <a href="#">By companies</a>
                <a href="#">By individuals</a>
                <a href="#">Recent expenditures</a>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">Elections</a>
              <div className={styles.dropdown}>
                <a href="#">By state</a>
                <a href="#">All elections</a>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">Rankings</a>
              <div className={styles.dropdown}>
                <a href="#">Super PACs</a>
                <a href="#">All committees</a>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">Influence</a>
              <div className={styles.dropdown}>
                <a href="#">Quid pro quo</a>
              </div>
            </div>
            <div className={styles.navItem}>
              <a href="#">About</a>
              <div className={styles.dropdown}>
                <a href="#">About</a>
                <a href="#">FAQ</a>
                <a href="#">Contact</a>
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
