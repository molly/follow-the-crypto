import { fetchConstant } from "@/app/actions/fetch";
import { CommitteeConstant, CommitteeDetails } from "@/app/types/Committee";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

import { fetchCommitteeDetails } from "@/app/actions/fetch";
import { isError } from "@/app/utils/errors";

export default async function CommitteeDisbursements({
  committeeId,
}: {
  committeeId: string;
}) {
  const [committeeData, committeeConstantData] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
  ]);

  if (isError(committeeData)) {
    return null;
  }

  const committee = committeeData as CommitteeDetails;

  if (
    !committee.disbursements_by_committee ||
    !Object.keys(committee.disbursements_by_committee).length
  ) {
    return null;
  }

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
        <Link href={`/2026/committees/${committeeId}`}>
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
    <section className={styles.disbursementsCard}>
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
                true,
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
