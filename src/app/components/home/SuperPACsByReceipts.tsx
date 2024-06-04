import TableContents from "@/app/components/home/SuperPACsByReceiptsTableContents";
import styles from "@/app/page.module.css";
import { range } from "@/app/utils/range";
import { Suspense } from "react";
import Skeleton from "../skeletons/Skeleton";

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

export default async function SuperPACsByReceipts() {
  return (
    <div className={styles.superPacCard}>
      <div>
        Despite the relatively small size of the cryptocurrency industry,
        cryptocurrency-focused super PACs are among the most well-funded this
        election cycle.
        <h2 className={styles.superPacHeader}>All super PACs</h2>
        <div className={styles.superPacTableWrapper}>
          <table className={styles.superPacTable}>
            <thead>
              <tr>
                <th></th>
                <th className="text-cell">Name</th>
                <th className={`text-cell ${styles.tableCellCollapse1}`}>
                  Description
                </th>
                <th
                  className={`number-cell ${styles.superPacTableCellMinWidth}`}
                >
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
              <Suspense fallback={<TableContentsSkeleton />}>
                <TableContents />
              </Suspense>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
