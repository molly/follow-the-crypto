/* eslint-disable @next/next/no-img-element */
import { fetchAllRecipients, fetchCompany, fetchNonCandidateCommittees } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import SpendingByParty from "@/app/components/individualOrCompany/SpendingByParty";
import sharedStyles from "@/app/shared.module.css";
import { Company } from "@/app/types/Companies";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase } from "@/app/utils/titlecase";
import { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: { company: string };
}): Promise<Metadata> {
  const { company } = await params;
  const companyName = titlecase(company.replaceAll("-", " "));
  return customMetadata({
    title: companyName,
    description: `Election spending by ${companyName} and related individuals.`,
  });
}

export default async function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  const { company: companyParam } = await params;
  const [companyData, recipientData, nonCandidateCommittees] = await Promise.all([
    fetchCompany(companyParam),
    fetchAllRecipients(),
    fetchNonCandidateCommittees(),
  ]);
  if (isError(companyData)) {
    return <ErrorText subject="company data" />;
  }
  const company = companyData as Company;
  const recipients = isError(recipientData)
    ? {}
    : (recipientData as Record<string, RecipientDetails>);
  return (
    <>
      <section className={styles.companyLogoAndName}>
        <div className={styles.companyLogoWrapper}>
          <img
            src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${companyParam}.webp`}
            alt={`${company.name} logo`}
            className={styles.companyLogoImage}
          />
        </div>
        <div className={styles.companyText}>
          <h1 className={styles.companyName}>{company.name}</h1>
          <div className="secondary">
            {company.country && company.country}
            {company.relatedIndividuals.length > 0 && (
              <>
                {company.country && <span> | </span>}
                <span>Related people: </span>
                <ul className={styles.plainList}>
                  {company.relatedIndividuals.map((individual) => (
                    <li key={individual.id} className={styles.plainListItem}>
                      <Link href={`/individuals/${individual.id}`}>
                        {individual.name}
                      </Link>
                      {individual.title && ` (${individual.title})`}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className={styles.description}>
            <span
              dangerouslySetInnerHTML={{
                __html: company.description || "",
              }}
            />
          </div>
        </div>
      </section>
      <div className={styles.page}>
        <section className={styles.contributionSection}>
          <h3 className={styles.contributionSectionHeader}>Contributions</h3>
          {company.contributions ? (
            company.contributions.map(
              (
                contributionGroup: IndividualOrCompanyContributionGroup,
                ind: number
              ) => {
                return (
                  <ContributionsGroup
                    key={`contrib-group-${ind}`}
                    contributionsGroup={contributionGroup}
                    recipient={recipients[contributionGroup.committee_id]}
                    company={company.name}
                    nonCandidateCommittees={nonCandidateCommittees}
                  />
                );
              }
            )
          ) : (
            <div className={`secondary ${styles.contributionRow}`}>
              No contributions yet.
            </div>
          )}
        </section>
        <div className={styles.spendingWrapper}>
          <section
            className={`${styles.spendingByPartySection} ${sharedStyles.constrainWidth}`}
          >
            <h2 id="spending-by-party">Contributions by party</h2>
            {company.party_summary && (
              <SpendingByParty
                partySummary={company.party_summary}
                labelId="spending-by-party"
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
