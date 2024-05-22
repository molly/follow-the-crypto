import { Expenditures } from "@/app/types/Expenditures";
import { getCommitteeNameById } from "@/app/utils/committees";
import { currency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

export default function ByCommittee({
  expenditures,
}: {
  expenditures: Expenditures;
}) {
  const committees = Object.keys(expenditures.by_committee).sort((a, b) => {
    return (
      expenditures.by_committee[b].total - expenditures.by_committee[a].total
    );
  });

  return (
    <div className={styles.committeeCard}>
      <h2>By group</h2>
      <div>
        {committees.map(async (committeeId) => {
          const result = await getCommitteeNameById(committeeId);
          let committeeName;
          let committeePathName;
          if (result) {
            if (typeof result === "object") {
              committeeName = result.name;
              committeePathName = result.pathName;
            } else {
              committeeName = result;
            }
          } else {
            committeeName = committeeId;
          }

          return (
            <div key={committeeId} className={styles.cardSection}>
              {committeePathName ? (
                <Link href={`/committee/${committeePathName}`}>
                  <h3>{committeeName}</h3>
                </Link>
              ) : (
                <h3>{committeeName}</h3>
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
