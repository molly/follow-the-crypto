"use client";

import styles from "@/app/components/tables.module.css";
import Link from "next/link";
import { useBreakpoint } from "../hooks/useBreakpoint";
import InfluencedRacesContents from "./InfluencedRacesContents";

export default function InfluencedRaces({
  fullPage = false,
}: {
  fullPage?: boolean;
}) {
  const useCompact = useBreakpoint(650);

  return (
    <div className={styles.influencedCard}>
      <div className={styles.tableCardContent}>
        <p>
          These PACs have already spent heavily to influence the outcome of
          multiple Congressional races.
        </p>
        <h2>{`${fullPage ? "R" : "Top r"}aces influenced by crypto industry money`}</h2>
      </div>
      <InfluencedRacesContents small={useCompact} fullPage={fullPage} />
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <Link href="/elections">&raquo; All races with crypto spending</Link>
        </div>
      )}
    </div>
  );
}
