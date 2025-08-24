"use client";

import Contribution from "@/app/components/individualOrCompany/Contribution";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualContributions } from "@/app/types/Individuals";
import { usePathname } from "next/navigation";
import styles from "./page.module.css";

function ByDate({
  individual,
  recipients,
}: {
  individual: IndividualContributions;
  recipients: Record<string, RecipientDetails>;
}) {
  if (!individual.contributions_by_date) {
    return null;
  }
  return individual.contributions_by_date.map((contribution, ind: number) => (
    <Contribution
      contribution={contribution}
      key={`contribution-${ind}`}
      recipient={
        contribution.committee_id && contribution.committee_id in recipients
          ? recipients[contribution.committee_id]
          : undefined
      }
    />
  ));
}

function ByRecipient({
  individual,
  recipients,
}: {
  individual: IndividualContributions;
  recipients: Record<string, RecipientDetails>;
}) {
  return individual.contributions.map(
    (contributionsGroup: IndividualOrCompanyContributionGroup, ind: number) => {
      return (
        <ContributionsGroup
          key={`contrib-group-${ind}`}
          contributionsGroup={contributionsGroup}
          recipient={recipients[contributionsGroup.committee_id]}
        />
      );
    },
  );
}

export default function ContributionsCardContent({
  individual,
  recipients,
}: {
  individual: IndividualContributions;
  recipients: Record<string, RecipientDetails>;
}) {
  const pathname = usePathname();

  return (
    <>
      <div className={styles.contributionCardHeader}>
        <h3 className={styles.contributionSectionHeader}>Contributions</h3>
      </div>
      <ByRecipient individual={individual} recipients={recipients} />
    </>
  );
}
