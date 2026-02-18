"use client";

import Contribution from "@/app/components/individualOrCompany/Contribution";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { IndividualContributions } from "@/app/types/Individuals";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

function ByDate({
  individual,
  recipients,
  nonCandidateCommittees,
}: {
  individual: IndividualContributions;
  recipients: Record<string, RecipientDetails>;
  nonCandidateCommittees: Set<string>;
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
      nonCandidateCommittees={nonCandidateCommittees}
    />
  ));
}

function ByRecipient({
  individual,
  recipients,
  nonCandidateCommittees,
}: {
  individual: IndividualContributions;
  recipients: Record<string, RecipientDetails>;
  nonCandidateCommittees: Set<string>;
}) {
  return individual.contributions.map(
    (contributionsGroup: IndividualOrCompanyContributionGroup, ind: number) => {
      return (
        <ContributionsGroup
          key={`contrib-group-${ind}`}
          contributionsGroup={contributionsGroup}
          recipient={recipients[contributionsGroup.committee_id]}
          nonCandidateCommittees={nonCandidateCommittees}
        />
      );
    },
  );
}

export default function ContributionsCardContent({
  individual,
  recipients,
  nonCandidateCommittees: nonCandidateCommitteesArray = [],
}: {
  individual: IndividualContributions;
  recipients: Record<string, RecipientDetails>;
  nonCandidateCommittees?: string[];
}) {
  const nonCandidateCommittees = new Set(nonCandidateCommitteesArray);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const sort = searchParams.get("sort") || "recipient";

  return (
    <>
      <div className={styles.contributionCardHeader}>
        <h3 className={styles.contributionSectionHeader}>Contributions</h3>
        <Link
          href={`${pathname}/${sort === "recipient" ? "?sort=date" : ""}`}
          className={styles.contributionCardSwitcher}
        >
          {`Sort by ${sort === "date" ? "recipient" : "date"}`}
        </Link>
      </div>
      {sort === "recipient" && (
        <ByRecipient individual={individual} recipients={recipients} nonCandidateCommittees={nonCandidateCommittees} />
      )}
      {sort === "date" && (
        <ByDate individual={individual} recipients={recipients} nonCandidateCommittees={nonCandidateCommittees} />
      )}
    </>
  );
}
