import MaybeLink from "@/app/components/MaybeLink";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Claimed from "./Claimed";
import CommitteeDetails from "./CommitteeDetails";
import Contribution from "./Contribution";
import styles from "./individualOrCompany.module.css";

export default function ContributionsGroup({
  contributionsGroup,
  recipient,
}: {
  contributionsGroup: IndividualOrCompanyContributionGroup;
  recipient?: RecipientDetails;
}) {
  if (contributionsGroup.contributions.length === 1) {
    const donor = contributionsGroup.contributions[0];
    return <Contribution contribution={donor} recipient={recipient} />;
  }

  const isClaimed = contributionsGroup.contributions.every(
    (c) => "claimed" in c && c.claimed,
  );

  return (
    <div className={styles.contributionRow}>
      <div className={styles.contributionSummary}>
        <span className={styles.contributionCommittee}>
          <MaybeLink href={recipient?.link}>
            {recipient?.committee_name
              ? titlecaseCommittee(recipient.committee_name, false)
              : contributionsGroup.committee_id}
          </MaybeLink>
          {isClaimed && (
            <>
              {" "}
              <Claimed />
            </>
          )}
        </span>
        <span>{formatCurrency(contributionsGroup.total)}</span>
      </div>
      <CommitteeDetails recipient={recipient} />
      <div className={styles.contributionsContainer}>
        {contributionsGroup.contributions.map((contribution, ind) => (
          <Contribution
            isSubRow={true}
            contribution={contribution}
            recipient={recipient}
            key={`contribution-${ind}`}
          />
        ))}
      </div>
    </div>
  );
}
