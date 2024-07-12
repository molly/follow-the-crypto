import MaybeLink from "@/app/components/MaybeLink";
import { HydratedIndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Claimed from "./Claimed";
import CommitteeDetails from "./CommitteeDetails";
import Contribution from "./Contribution";
import styles from "./individualOrCompany.module.css";

export default function ContributionsGroup({
  contributionsGroup,
}: {
  contributionsGroup: HydratedIndividualOrCompanyContributionGroup;
}) {
  if (contributionsGroup.contributions.length === 1) {
    const donor = contributionsGroup.contributions[0];
    return (
      <Contribution
        contribution={donor}
        contributionsGroup={contributionsGroup}
      />
    );
  }

  const isClaimed = contributionsGroup.contributions.every(
    (c) => "claimed" in c && c.claimed,
  );

  return (
    <div className={styles.contributionRow}>
      <div className={styles.contributionSummary}>
        <span className={styles.contributionCommittee}>
          <MaybeLink href={contributionsGroup.link}>
            {contributionsGroup.committee_name
              ? titlecaseCommittee(contributionsGroup.committee_name, false)
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
      <CommitteeDetails contributionsGroup={contributionsGroup} />
      <div className={styles.contributionsContainer}>
        {contributionsGroup.contributions.map((contribution, ind) => (
          <Contribution
            isSubRow={true}
            contribution={contribution}
            contributionsGroup={contributionsGroup}
            key={`contribution-${ind}`}
          />
        ))}
      </div>
    </div>
  );
}
