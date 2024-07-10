/* eslint-disable @next/next/no-img-element */
import {
  fetchConstant,
  fetchIndividualContributions,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import { HydratedIndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import {
  HydratedIndividualContributions,
  IndividualConstant,
} from "@/app/types/Individuals";
import { isError } from "@/app/utils/errors";
import ContributionsGroup from "./ContributionsGroup";
import SpendingByParty from "./SpendingByParty";
import styles from "./page.module.css";

export default async function CompanyPage({
  params,
}: {
  params: { individual: string };
}) {
  const [individualData, contributionsData] = await Promise.all([
    fetchConstant("individuals"),
    fetchIndividualContributions(params.individual),
  ]);
  if (isError(individualData)) {
    return <ErrorText subject="individual data" />;
  }
  if (isError(contributionsData)) {
    return <ErrorText subject="individual contributions data" />;
  }
  const individual = (individualData as Record<string, IndividualConstant>)[
    params.individual
  ];
  const { contributions, party_summary } =
    contributionsData as HydratedIndividualContributions;

  return (
    <>
      <section>
        <div className={styles.companyLogoAndName}>
          <img
            src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${params.individual}.webp`}
            alt={`${individual.name} photo`}
            className={styles.individualImage}
          />
          <div>
            <h1 className={styles.companyName}>{individual.name}</h1>
          </div>
        </div>
      </section>
      <div className={styles.page}>
        <section className={styles.contributionSection}>
          <h3 className={styles.contributionSectionHeader}>Contributions</h3>
          {contributions.length ? (
            contributions.map(
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
          {party_summary && (
            <SpendingByParty
              partySummary={party_summary}
              labelId="spending-by-party"
            />
          )}
        </section>
      </div>
    </>
  );
}
