import { fetchConstant } from "@/app/actions/fetch";
import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditures } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { currency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

export default async function ByCommittee({
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
    <div className={styles.committeeCard}>
      <h2>By group</h2>
      <div>
        {committeesSortedByExpenditures.map((committeeId) => {
          let committee;
          if (committees && committeeId in committees) {
            committee = committees[committeeId];
          }

          return (
            <div key={committeeId} className={styles.cardSection}>
              {committee ? (
                <Link href={`/committee/${committeeId}`}>
                  <h3>{committee.name}</h3>
                </Link>
              ) : (
                <h3>{committeeId}</h3>
              )}
              <b>
                {currency(expenditures.by_committee[committeeId].total, true)}
              </b>
            </div>
          );
        })}
      </div>
    </div>
  );
}
