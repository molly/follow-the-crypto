"use client";

import styles from "@/app/components/tables.module.css";
import Link from "next/link";
import useResizeObserver from "use-resize-observer";
import InfluencedRacesContents from "./InfluencedRacesContents";

export default function InfluencedRaces({
  fullPage = false,
}: {
  fullPage?: boolean;
}) {
  const { ref, width = 1000 } = useResizeObserver<HTMLDivElement>();
  return (
    <div className={styles.influencedCard} ref={ref}>
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <p>
            These super PACs and other cryptocurrency-funded groups have already
            spent heavily to influence the outcome of multiple Congressional
            races.
          </p>
          <h2>Races influenced by crypto industry money</h2>
        </div>
      )}
      <InfluencedRacesContents small={width < 650} fullPage={fullPage} />
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <Link href="/races">&raquo; View all races with crypto spending</Link>
        </div>
      )}
    </div>
  );
}
