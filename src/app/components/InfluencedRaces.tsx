import styles from "@/app/components/tables.module.css";
import { range } from "@/app/utils/range";
import Link from "next/link";
import { Suspense } from "react";
import { CandidateSkeleton } from "./Candidate";
import OverflowSection from "./OverflowSection";
import Skeleton from "./skeletons/Skeleton";

function InfluencedRacesTableContentsSkeleton({
  fullPage,
}: {
  fullPage: boolean;
}) {
  return range(fullPage ? 20 : 5).map((i) => (
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

export default function InfluencedRaces({
  children,
  fullPage = false,
}: {
  children: React.ReactNode;
  fullPage?: boolean;
}) {
  return (
    <div className={styles.influencedCard}>
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
      <OverflowSection fullPage={fullPage} headerHeight="2.2rem">
        <table className={styles.influencedTable}>
          <thead>
            <tr className={styles.influencedTableHeader}>
              <th className="text-cell">Candidate</th>
              <th className="center-cell">State</th>
              <th className="center-cell">Office</th>
              <th className="number-cell">Support</th>
              <th className="number-cell">Oppose</th>
              <th className="text-cell">Outcome</th>
            </tr>
          </thead>
          <tbody>
            <Suspense
              fallback={
                <InfluencedRacesTableContentsSkeleton fullPage={fullPage} />
              }
            >
              {children}
            </Suspense>
          </tbody>
        </table>
      </OverflowSection>
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <Link href="/races">&raquo; View all races with crypto spending</Link>
        </div>
      )}
    </div>
  );
}
