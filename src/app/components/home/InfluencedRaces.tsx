"use client";

import useFade from "@/app/hooks/useFade";
import styles from "@/app/page.module.css";
import { range } from "@/app/utils/range";
import { motion, useScroll } from "framer-motion";
import { Suspense, useRef } from "react";
import { CandidateSkeleton } from "../Candidate";
import Skeleton from "../skeletons/Skeleton";

function InfluencedRacesTableContentsSkeleton() {
  return range(5).map((i) => (
    <tr
      key={`influenced-skeleton-row-${i}`}
      className={styles.influencedTableRow}
    >
      <td style={{ width: "19rem" }}>
        <CandidateSkeleton onCard={true} />
      </td>
      <td>
        <Skeleton width="1.5rem" onCard={true} style={{ margin: "0 auto" }} />
      </td>
      <td>
        <Skeleton
          randWidth={[3, 7]}
          onCard={true}
          style={{ margin: "0 auto" }}
        />
      </td>
      <td>
        <Skeleton width="3rem" onCard={true} style={{ float: "right" }} />
      </td>
      <td>
        <Skeleton width="3rem" onCard={true} style={{ float: "right" }} />
      </td>
      <td style={{ width: "28rem" }}>
        <Skeleton width="20rem" onCard={true} />
      </td>
    </tr>
  ));
}

export function InfluencedRaces({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const fade = useFade(scrollYProgress);

  return (
    <div className={`${styles.influencedCard}`}>
      These super PACs and other cryptocurrency-funded groups have already spent
      heavily to influence the outcome of multiple Congressional races.
      <h2>Races influenced by crypto industry money</h2>
      <motion.div
        className={styles.influencedTableWrapper}
        ref={containerRef}
        style={{
          maskImage: fade,
        }}
      >
        <table className={styles.influencedTable}>
          <thead>
            <tr>
              <th className="text-cell">Candidate</th>
              <th className="center-cell">State</th>
              <th className="center-cell">Office</th>
              <th className="number-cell">Support</th>
              <th className="number-cell">Oppose</th>
              <th className="text-cell">Outcome</th>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<InfluencedRacesTableContentsSkeleton />}>
              {children}
            </Suspense>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
