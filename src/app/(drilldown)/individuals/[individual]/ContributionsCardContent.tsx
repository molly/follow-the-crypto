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
}: {
  individual: IndividualContributions;
  recipients: Record<string, RecipientDetails>;
}) {
  return individual.contributions_by_date.map((contribution, ind: number) => (
    <Contribution
      contribution={contribution}
      key={`contribution-${ind}`}
      recipient={recipients[contribution.committee_id]}
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
        <ByRecipient individual={individual} recipients={recipients} />
      )}
      {sort === "date" && (
        <ByDate individual={individual} recipients={recipients} />
      )}
    </>
  );
}
