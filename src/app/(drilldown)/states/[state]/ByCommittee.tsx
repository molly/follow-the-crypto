import { fetchConstant } from "@/app/actions/fetch";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditures } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import { Suspense } from "react";
import styles from "./page.module.css";

async function CommitteeCardContents({
  expenditures,
}: {
  expenditures: Expenditures;
}) {
  const data = await fetchConstant("committees");
  const committees = isError(data)
    ? null
    : (data as Record<string, CommitteeConstant>);

  const committeesSortedByExpenditures = Object.keys(
    expenditures.by_committee,
  ).sort((a, b) => {
    return (
      expenditures.by_committee[b].total - expenditures.by_committee[a].total
    );
  });

  return (
    <div>
      {committeesSortedByExpenditures.map((committeeId) => {
        let committee;
        if (committees && committeeId in committees) {
          committee = committees[committeeId];
        }
        return (
          <div key={committeeId} className={styles.cardSection}>
            {committee ? (
              <Link href={`/committees/${committeeId}`}>
                <h3>{committee.name}</h3>
              </Link>
            ) : (
              <h3>{committeeId}</h3>
            )}
            <b>
              {formatCurrency(
                expenditures.by_committee[committeeId].total,
                true,
              )}
            </b>
          </div>
        );
      })}
    </div>
  );
}

function CommitteeCardContentsSkeleton() {
  return (
    <div className={styles.cardSection}>
      <Skeleton randWidth={[5, 15]} height={"1.17em"} />
      <Skeleton width={"5em"} />
    </div>
  );
}

export default async function ByCommittee({
  expenditures,
}: {
  expenditures: Expenditures;
}) {
  return (
    <div className={styles.committeeCard}>
      <h2>By group</h2>
      <Suspense fallback={<CommitteeCardContentsSkeleton />}>
        <CommitteeCardContents expenditures={expenditures} />
      </Suspense>
    </div>
  );
}
