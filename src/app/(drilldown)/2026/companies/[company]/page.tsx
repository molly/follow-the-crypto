/* eslint-disable @next/next/no-img-element */
import {
  fetchAllRecipients,
  fetchCompany,
  fetchNonCandidateCommittees,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import SpendingByParty from "@/app/components/individualOrCompany/SpendingByParty";
import InformationalTooltip from "@/app/components/InformationalTooltip";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import sharedStyles from "@/app/shared.module.css";
import { Company } from "@/app/types/Companies";
import {
  IndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { formatCompanyName } from "@/app/utils/names";
import { titlecase } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import CompanySpendingMap from "./CompanySpendingMap";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const companyName = formatCompanyName(
    titlecase(company.replaceAll("-", " ")),
  );
  return customMetadata({
    title: companyName,
    description: `Election spending by ${companyName} and related individuals.`,
  });
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company: companyParam } = await params;
  const [companyData, recipientData, nonCandidateCommittees] =
    await Promise.all([
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
  const companyTotal = Object.values(company.party_summary).reduce(
    (acc, total) => acc + total,
    0,
  );
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
                      <Link href={`/2026/individuals/${individual.id}`}>
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
          <h3 className={styles.contributionSectionHeader}>
            <span>Contributions</span>
            <span>{formatCurrency(companyTotal, true)}</span>
          </h3>
          {company.contributions ? (
            company.contributions.map(
              (
                contributionGroup: IndividualOrCompanyContributionGroup,
                ind: number,
              ) => {
                return (
                  <ContributionsGroup
                    key={`contrib-group-${ind}`}
                    contributionsGroup={contributionGroup}
                    recipient={recipients[contributionGroup.committee_id]}
                    company={company.name}
                    relatedIndividuals={company.relatedIndividuals}
                    nonCandidateCommittees={nonCandidateCommittees}
                  />
                );
              },
            )
          ) : (
            <div className={`secondary ${styles.contributionRow}`}>
              No contributions yet.
            </div>
          )}
        </section>
        <div className={styles.spendingWrapper}>
          <section
            className={`${styles.spendingByStateSection} ${sharedStyles.constrainWidth}`}
          >
            <div className={sharedStyles.card}>
              <h2 id="company-spending-by-state">
                Approximate
                <InformationalTooltip>
                  <p>
                    Some committees (particularly super PACs) spend cross-state
                    or are not associated with a specific candidate, and
                    contributions to them are omitted from this chart.
                  </p>
                  <p>
                    This relies on manual classification and so represents a
                    conservative estimate of industry spending.
                  </p>
                </InformationalTooltip>{" "}
                spending by state
              </h2>
              <Suspense fallback={<USMapSkeleton />}>
                <CompanySpendingMap
                  companyId={companyParam}
                  labelId="company-spending-by-state"
                />
              </Suspense>
            </div>
          </section>
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
