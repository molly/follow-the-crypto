import MaybeLink from "@/app/components/MaybeLink";
import {
  Contribution as ContributionType,
  HydratedIndividualOrCompanyContributionGroup,
  IndividualOrCompanyContribution,
} from "@/app/types/Contributions";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";
import CommitteeDetails from "./CommitteeDetails";
import styles from "./page.module.css";

function ContributionDate({
  contribution,
}: {
  contribution: ContributionType;
}) {
  if (
    "contribution_receipt_date" in contribution &&
    contribution.contribution_receipt_date
  ) {
    return (
      <span
        className={styles.contributionDate}
      >{`${formatDateFromString(contribution.contribution_receipt_date)}`}</span>
    );
  }
  return null;
}

function ContributionAmount({
  contribution,
  isSubRow = false,
}: {
  contribution: ContributionType;
  isSubRow?: boolean;
}) {
  if (
    "contribution_receipt_amount" in contribution &&
    contribution.contribution_receipt_amount
  ) {
    return (
      <span className={isSubRow ? styles.subRowCurrency : ""}>
        {formatCurrency(contribution.contribution_receipt_amount)}
      </span>
    );
  }
  return null;
}

export default function Contribution({
  contribution,
  contributionsGroup,
  isSubRow,
}: {
  contribution: IndividualOrCompanyContribution;
  contributionsGroup: HydratedIndividualOrCompanyContributionGroup;
  isSubRow?: boolean;
}) {
  const formattedName = contributionsGroup.committee_name
    ? titlecaseCommittee(contributionsGroup.committee_name, false)
    : contributionsGroup.committee_id;
  if (isSubRow) {
    return (
      <div className={styles.contributionSubRow}>
        <div>
          <ContributionDate contribution={contribution} />
        </div>
        <ContributionAmount contribution={contribution} isSubRow={true} />
      </div>
    );
  } else {
    // TOP-LEVEL ROW
    return (
      <div className={styles.contributionRow}>
        <div className={styles.contributionSummary}>
          <span className={styles.contributionCommittee}>
            <MaybeLink href={contributionsGroup.link}>
              {formattedName}
            </MaybeLink>
          </span>
          <ContributionAmount contribution={contribution} />
        </div>
        <CommitteeDetails contributionsGroup={contributionsGroup} />
      </div>
    );
  }
}
