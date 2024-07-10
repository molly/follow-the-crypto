/* eslint-disable @next/next/no-img-element */
import { fetchCompany } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import ContributionsGroup from "@/app/components/individualOrCompany/ContributionsGroup";
import SpendingByParty from "@/app/components/individualOrCompany/SpendingByParty";
import { Company } from "@/app/types/Companies";
import { HydratedIndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";
import Link from "next/link";
import styles from "./page.module.css";

export default async function CompanyPage({
  params,
}: {
  params: { company: string };
}) {
  const companyData = await fetchCompany(params.company);
  if (isError(companyData)) {
    return <ErrorText subject="company data" />;
  }
  const company = companyData as Company;
  return (
    <>
      <section>
        <div className={styles.companyLogoAndName}>
          <div className={styles.companyLogoWrapper}>
            <img
              src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${params.company}.webp`}
              alt={`${company.name} logo`}
              className={styles.companyLogoImage}
            />
          </div>
          <div>
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
        </div>
      </section>
      <div className={styles.page}>
        <section className={styles.contributionSection}>
          <h3 className={styles.contributionSectionHeader}>Contributions</h3>
          {company.contributions.length ? (
            company.contributions.map(
              (
                contributionGroup: HydratedIndividualOrCompanyContributionGroup,
                ind: number,
              ) => (
                <ContributionsGroup
                  key={`contrib-group-${ind}`}
                  contributionsGroup={contributionGroup}
                />
              ),
            )
          ) : (
            <div className={`secondary ${styles.contributionRow}`}>
              No contributions yet.
            </div>
          )}
        </section>
        <section className={styles.spendingByPartySection}>
          <h2 id="spending-by-party">Contributions by party</h2>
          {company.party_summary && (
            <SpendingByParty
              partySummary={company.party_summary}
              labelId="spending-by-party"
            />
          )}
        </section>
      </div>
    </>
  );
}
