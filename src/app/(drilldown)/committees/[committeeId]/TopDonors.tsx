import {
  Contributions,
  ContributionsGroup as ContributionsGroupType,
} from "@/app/types/Contributions";
import ContributionsGroup from "./ContributionsGroup";
import styles from "./page.module.css";

import { fetchCommitteeDonors } from "@/app/actions/fetch";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { is4xx, isError } from "@/app/utils/errors";
import { range } from "@/app/utils/range";

export function TopDonorsSkeleton() {
  return (
    <section className={styles.donorSection}>
      <h3 className={styles.donorSectionHeader}>Top donors</h3>
      {[6, 2, 6, 3].map((items, ind) => (
        <div className={styles.donorRow} key={`top-donors-skeleton-row-${ind}`}>
          <div className={styles.donorSummary}>
            <Skeleton height="1.125rem" width="10rem" onCard={true} />
            <Skeleton height="1.125rem" width="10rem" onCard={true} />
          </div>
          <div className={styles.contributionsContainer}>
            {range(items).map((j) => (
              <div
                className={styles.donorSubRow}
                key={`top-donors-skeleton-subrow-${ind}-${j}`}
              >
                <Skeleton width="12rem" onCard={true} />
                <Skeleton width="8rem" onCard={true} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default async function TopDonors({
  committeeId,
}: {
  committeeId: string;
}) {
  const donorData = await fetchCommitteeDonors(committeeId);

  if (isError(donorData)) {
    if (is4xx(donorData)) {
      return <div>Committee not found.</div>;
    } else {
      return <div>Something went wrong when fetching committee details.</div>;
    }
  }

  const donors = donorData as Contributions;

  return (
    <section className={styles.donorSection}>
      <h3 className={styles.donorSectionHeader}>Top donors</h3>
      {donors.groups.length ? (
        donors.groups.map((donorGroup: ContributionsGroupType, ind: number) => (
          <ContributionsGroup key={`donor-${ind}`} donorGroup={donorGroup} />
        ))
      ) : (
        <div className={`secondary ${styles.donorRow}`}>No donors found.</div>
      )}
    </section>
  );
}
