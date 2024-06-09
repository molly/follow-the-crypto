"use client";

import styles from "@/app/components/tables.module.css";
import useFade from "@/app/hooks/useFade";
import { range } from "@/app/utils/range";
import { motion, useScroll } from "framer-motion";
import { Suspense, useRef } from "react";
import Skeleton from "./skeletons/Skeleton";

function TableContentsSkeleton() {
  return range(10).map((i) => {
    return (
      <tr className={styles.superPacRow} key={`superPac-skeleton-row-${i}`}>
        <td></td>
        <td>
          <Skeleton randWidth={[6, 18]} onCard={true} />
        </td>
        <td>
          <Skeleton randWidth={[6, 18]} onCard={true} />
        </td>
        <td>
          <Skeleton width="6rem" onCard={true} style={{ float: "right" }} />
        </td>
        <td>
          <Skeleton width="6rem" onCard={true} style={{ float: "right" }} />
        </td>
        <td>
          <Skeleton width="6rem" onCard={true} style={{ float: "right" }} />
        </td>
      </tr>
    );
  });
}

export default function SuperPACsByReceipts({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const fade = useFade(scrollYProgress);

  return (
    <div className={styles.superPacCard}>
      <div className={styles.tableCardContent}>
        <p>
          Despite the relatively small size of the cryptocurrency industry,
          cryptocurrency-focused super PACs are among the most well-funded this
          election cycle.
        </p>
        <h2 className={styles.superPacHeader}>All super PACs</h2>
      </div>
      <motion.div
        className={styles.superPacTableWrapper}
        ref={containerRef}
        style={{ maskImage: fade }}
      >
        <table className={styles.superPacTable}>
          <thead>
            <tr className={styles.superPacTableHeader}>
              <th></th>
              <th className="text-cell">Name</th>
              <th className={`text-cell ${styles.tableCellCollapse1}`}>
                Description
              </th>
              <th className={`number-cell ${styles.superPacTableCellMinWidth}`}>
                Receipts
              </th>
              <th
                className={`number-cell ${styles.superPacTableCellMinWidth} ${styles.tableCellCollapse2}`}
              >
                Disbursements
              </th>
              <th
                className={`number-cell ${styles.superPacTableCellMinWidth} ${styles.tableCellCollapse2}`}
              >
                Cash on hand
              </th>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<TableContentsSkeleton />}>{children}</Suspense>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
