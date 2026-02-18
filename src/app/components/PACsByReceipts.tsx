import styles from "@/app/components/tables.module.css";
import { range } from "@/app/utils/range";
import Link from "next/link";
import { Suspense } from "react";
import Skeleton from "./skeletons/Skeleton";

function TableContentsSkeleton({ type }: { type: string }) {
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
        {type === "all" && (
          <td>
            <Skeleton width="6rem" onCard={true} style={{ float: "right" }} />
          </td>
        )}
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
  return (
    <div className={styles.superPacCard}>
      <div className={styles.tableCardContent}>
        <p>
          Despite the relatively small size of the cryptocurrency industry,
          cryptocurrency-focused PACs are among the most well-funded this
          election cycle.
        </p>
        <p className="secondary smaller">
          Issues in FEC reporting may affect this list; see the{" "}
          <Link href="/about/faq#pacs-data">FAQ</Link>.
        </p>
        <h2 className={styles.superPacHeader}>
          {`Where crypto-focused PACs fall among the most highly funded ${type === "super" ? "super " : ""}PACs`}
        </h2>
        {fullPage && type === "super" && (
          <p className="secondary smaller">
            This list includes only PACs that are designated with the FEC as
            independent expenditure only political committees (super PACs), and
            does not include hybrid PACs. To view all political action and party
            committees, including hybrid PACs, see the{" "}
            <Link href="/2026/committees/ranking/all">list of all PACs</Link>.
          </p>
        )}
      </div>
      <table className={styles.superPacTable}>
        <thead>
          <tr className={styles.superPacTableHeader}>
            <th></th>
            <th className="text-cell">Name</th>
            <th className={`text-cell ${styles.tableCellCollapse1}`}>
              Description
            </th>
            {type === "all" && (
              <th className={`text-cell ${styles.tableCellCollapse1}`}>Type</th>
            )}
          </tr>
        </thead>
        <tbody>
          <Suspense fallback={<TableContentsSkeleton type={type} />}>
            {children}
          </Suspense>
        </tbody>
      </table>
      <div className={styles.tableCardContent}>
        {!fullPage && type === "super" && (
          <>
            <div className="secondary smaller">
              This list includes only PACs that are designated with the FEC as
              independent expenditure only political committees (super PACs),
              and does not include hybrid PACs. To view all political action and
              party committees, including hybrid PACs, see the{" "}
              <Link href="/2026/committees/ranking/all">list of all PACs</Link>.
            </div>
            <div className={styles.viewMoreLinks}>
              <div className={styles.viewMoreLink}>
                <Link href="/2026/committees/ranking/super">
                  &raquo; All super PACs
                </Link>
              </div>
              <div className={styles.viewMoreLink}>
                <Link href="/2026/committees/ranking/all">&raquo; All PACs</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
