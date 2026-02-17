import { fetchBeneficiaries, fetchElection } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import {
  Beneficiary,
  BeneficiaryContribution,
  CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { ElectionGroup } from "@/app/types/Elections";
import { is4xx, isError } from "@/app/utils/errors";
import { humanizeList } from "@/app/utils/humanize";
import {
  titlecaseCommittee,
  titlecaseLastFirst,
  titlecaseOccupation,
} from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

function Contribution({
  contribution,
}: {
  contribution: BeneficiaryContribution;
}) {
  const contributorName =
    contribution.isIndividual && contribution.contributor_name ? (
      <Link href={`/individuals/${contribution.individual}`}>
        {titlecaseLastFirst(contribution.contributor_name)}
      </Link>
    ) : contribution.contributor_name ? (
      titlecaseCommittee(contribution.contributor_name)
    ) : null;
  const committeeNames = contribution.committees.length
    ? humanizeList(contribution.committees.map((c) => titlecaseCommittee(c)))
    : null;
  return (
    <li className={styles.otherSupportContribution}>
      <span>{formatCurrency(contribution.total)}</span>
      {contributorName && <span> from {contributorName}</span>}
      {contribution.contributor_occupation && (
        <span className="secondary">
          {` (${titlecaseOccupation(contribution.contributor_occupation)})`}
        </span>
      )}
      {committeeNames && <span>{` via ${committeeNames}`}</span>}
    </li>
  );
}

function CompanyGroup({ group }: { group: CompanyContributionGroup }) {
  return (
    <div className={styles.companyGroup}>
      <div className={styles.companyGroupHeader}>
        <Link href={`/companies/${group.company_id}`}>
          {group.company_name}
        </Link>
        {" — "}
        {formatCurrency(group.total, true)}
      </div>
      <ul className={styles.otherSupportContributions}>
        {group.contributions.map((contribution, ind) => (
          <Contribution
            key={`${group.company_id}-${ind}`}
            contribution={contribution}
          />
        ))}
      </ul>
    </div>
  );
}

export default async function OtherSupport({ raceId }: { raceId: string }) {
  const [electionData, beneficiaryData] = await Promise.all([
    fetchElection(raceId),
    fetchBeneficiaries(),
  ]);
  if (isError(electionData) || isError(beneficiaryData)) {
    if (is4xx(electionData) || is4xx(beneficiaryData)) {
      return (
        <span className="secondary">
          No other support from cryptocurrency industry-associated companies or
          individuals has been recorded for candidates in this election.
        </span>
      );
    }
    return <ErrorText subject="other candidate support" />;
  }
  const election = electionData as ElectionGroup;
  const beneficiaries = beneficiaryData as Record<string, Beneficiary>;

  const supportedCandidates = Object.values(election.candidates)
    .filter((c) => c.has_non_pac_support)
    .sort((a, b) => {
      const aTotal = a.candidate_id ? beneficiaries[a.candidate_id].total : 0;
      const bTotal = b.candidate_id ? beneficiaries[b.candidate_id].total : 0;
      return bTotal - aTotal;
    });

  return (
    <div>
      {supportedCandidates.map((c) => {
        if (!c.candidate_id) {
          return null;
        }
        const beneficiary = beneficiaries[c.candidate_id];
        return (
          <section key={c.candidate_id} className={styles.otherSupportSection}>
            <h3 className="no-margin">{c.common_name}</h3>
            <div>{`${formatCurrency(beneficiary.total, true)} in total other support from companies and individuals`}</div>
            {beneficiary.contributions.map((group) => (
              <CompanyGroup
                key={`${c.candidate_id}-${group.company_id}`}
                group={group}
              />
            ))}
          </section>
        );
      })}
      <div className={`${styles.tableCardContent} secondary small`}>
        Other support to a candidate may exceed the amounts shown in the
        &ldquo;Money involved in this election&rdquo; chart if funds have been
        contributed to a super PAC aligned with a candidate, but the PAC has not
        yet spent the funds.
      </div>
    </div>
  );
}
