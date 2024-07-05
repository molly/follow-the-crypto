"use client";

import styles from "@/app/components/tables.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import InfluencedRacesContents from "./InfluencedRacesContents";

export default function InfluencedRaces({
  fullPage = false,
}: {
  fullPage?: boolean;
}) {
  const [useCompact, setUseCompact] = useState(false);
  useEffect(() => {
    if (window && window.innerWidth < 650) {
      setUseCompact(true);
    }
  }, [setUseCompact]);

  return (
    <div className={styles.influencedCard}>
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <p>
            These super PACs and other cryptocurrency-funded groups have already
            spent heavily to influence the outcome of multiple Congressional
            races.
          </p>
          <h2>{`${fullPage ? "R" : "Top r"}aces influenced by crypto industry money`}</h2>
        </div>
      )}
      <InfluencedRacesContents small={useCompact} fullPage={fullPage} />
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <Link href="/races">&raquo; View all races with crypto spending</Link>
        </div>
      )}
    </div>
  );
}
