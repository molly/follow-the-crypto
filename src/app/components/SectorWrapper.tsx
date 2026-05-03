"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import SectorButtons from "./SectorButtons";
import styles from "./header.module.css";

export default function SectorWrapper() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/about") ||
    pathname.includes("/committees/ranking/")
  ) {
    return null;
  }
  return (
    <div className={styles.sectorWrapper}>
      <div className={styles.sectorContents}>
        Showing:
        <Suspense fallback={null}>
          <SectorButtons />
        </Suspense>
      </div>
    </div>
  );
}
