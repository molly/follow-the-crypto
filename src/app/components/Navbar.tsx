"use client";

import Breadcrumbs from "./Breadcrumbs";
import styles from "./header.module.css";

export default function Navbar() {
  return (
    <aside className={styles.navbarContainer}>
      <nav>
        <Breadcrumbs />
      </nav>
    </aside>
  );
}
