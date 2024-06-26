"use client";

import styles from "@/app/components/tables.module.css";
import useFade from "@/app/hooks/useFade";
import { range } from "@/app/utils/range";
import { motion, useScroll } from "framer-motion";
import Link from "next/link";
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

export default function PACsByReceipts({
  children,
  type,
  fullPage = false,
}: {
  children: React.ReactNode;
  type: string;
  fullPage?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const fade = useFade(scrollYProgress);

  return (
    <div className={styles.superPacCard}>
      <div className={styles.tableCardContent}>
        <p>
          Despite the relatively small size of the cryptocurrency industry,
          cryptocurrency-focused PACs are among the most well-funded this
          election cycle.
        </p>
        <h2 className={styles.superPacHeader}>
          {`Most highly funded ${type === "super" ? "super " : ""}PACs`}
        </h2>
        {fullPage && type === "super" && (
          <p className="secondary smaller">
            This list includes only PACs that are designated with the FEC as
            independent expenditure only political committees (super PACs), and
            does not include hybrid PACs. To view all political action and party
            committees, including hybrid PACs, see the{" "}
            <Link href="/committees/ranking/all">list of all PACs</Link>.
          </p>
        )}
      </div>
      <motion.div
        className={fullPage ? undefined : styles.superPacTableWrapper}
        ref={containerRef}
        style={{ maskImage: fullPage ? undefined : fade }}
      >
        <table className={styles.superPacTable}>
          <thead>
            <tr className={styles.superPacTableHeader}>
              <th></th>
              <th className="text-cell">Name</th>
              <th className={`text-cell ${styles.tableCellCollapse1}`}>
                Description
              </th>
              {type === "all" && (
                <th className={`text-cell ${styles.tableCellCollapse1}`}>
                  Type
                </th>
              )}
              <th className={`number-cell ${styles.superPacTableCellMinWidth}`}>
                Receipts
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
      {!fullPage && (
        <div className={styles.tableCardContent}>
          {type === "super" && (
            <p className="secondary smaller">
              This list includes only PACs that are designated with the FEC as
              independent expenditure only political committees (super PACs),
              and does not include hybrid PACs. To view all political action and
              party committees, including hybrid PACs, see the{" "}
              <Link href="/committees/ranking/all">list of all PACs</Link>.
            </p>
          )}
          <Link
            className={styles.viewMoreLink}
            href="/committees/ranking/super"
          >
            &raquo; View ranking of super PACs
          </Link>
          <Link className={styles.viewMoreLink} href="/committees/ranking/all">
            &raquo; View ranking of all PACs
          </Link>
        </div>
      )}
    </div>
  );
}
