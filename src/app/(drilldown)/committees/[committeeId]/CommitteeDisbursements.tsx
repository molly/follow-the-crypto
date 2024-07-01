import { fetchConstant } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeConstant, CommitteeDetails } from "@/app/types/Committee";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

export default async function CommitteeDisbursements({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  if (!committee.disbursements_by_committee) {
    return null;
  }

  const committeeConstantData =
    await fetchConstant<Record<string, CommitteeConstant>>("committees");
  const committeeConstants = committeeConstantData || {};

  const recipientCommitteeIds = Object.keys(
    committee.disbursements_by_committee,
  );
  const sortedRecipientCommitteeIds = recipientCommitteeIds.sort((a, b) => {
    return (
      committee.disbursements_by_committee[b].total -
      committee.disbursements_by_committee[a].total
    );
  });

  function renderCommitteeName(committeeId: string) {
    if (committeeConstants[committeeId]) {
      return (
        <Link href={`/committees/${committeeId}`}>
          {committeeConstants[committeeId].name}
        </Link>
      );
    } else {
      return titlecaseCommittee(
        committee.disbursements_by_committee[committeeId].recipient_name,
      );
    }
  }

  return (
    <section className={sharedStyles.card}>
      <h2>Transfers to other committees</h2>
      <ul className={styles.committeeDisbursementsList}>
        {sortedRecipientCommitteeIds.map((recipientCommitteeId) => (
          <li
            key={recipientCommitteeId}
            className={styles.committeeDisbursementsListItem}
          >
            <span>{renderCommitteeName(recipientCommitteeId)}</span>
            <span>
              {formatCurrency(
                committee.disbursements_by_committee[recipientCommitteeId]
                  .total,
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
