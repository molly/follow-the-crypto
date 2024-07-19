/* eslint-disable @next/next/no-img-element */
import { fetchConstant, fetchIndividual } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import SpendingByParty from "@/app/components/individualOrCompany/SpendingByParty";
import sharedStyles from "@/app/shared.module.css";
import {
  IndividualConstant,
  IndividualContributions,
} from "@/app/types/Individuals";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase, titlecaseCompany } from "@/app/utils/titlecase";
import { Metadata } from "next";
import Link from "next/link";
import Contributions from "./Contributions";
import styles from "./page.module.css";

export function generateMetadata({
  params,
}: {
  params: { individual: string };
}): Metadata {
  const individualName = titlecase(params.individual.replaceAll("-", " "));
  return customMetadata({
    title: individualName,
    description: `Election spending by ${individualName}.`,
  });
}

function Subhead({
  individual,
  associatedCompany,
}: {
  individual: IndividualConstant;
  associatedCompany?: string;
}) {
  let subhead = [];
  if (individual.title) {
    if (!associatedCompany && !individual.company) {
      return <span>{individual.title}</span>;
    }
    subhead.push(<span>{`${individual.title} at `}</span>);
  }
  if (associatedCompany) {
    if (!individual.title) {
      subhead.push(<span>Associated with </span>);
    }
    subhead.push(
      <Link href={`/companies/${associatedCompany}`}>
        {titlecaseCompany(associatedCompany.replaceAll("-", " "))}
      </Link>,
    );
  } else if (individual.company) {
    subhead.push(<span>{individual.company}</span>);
  }
  return subhead;
}

export default async function IndividualPage({
  params,
}: {
  params: { individual: string };
}) {
  const [individualData, contributionsData] = await Promise.all([
    fetchConstant("individuals"),
    fetchIndividual(params.individual),
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
  const { associatedCompany, party_summary } =
    contributionsData as IndividualContributions;

  return (
    <>
      <section className={styles.imageAndName}>
        <div className={styles.imageAndAttribution}>
          <img
            src={`https://storage.googleapis.com/follow-the-crypto-misc-assets/${params.individual}.webp`}
            alt={`${individual.name} photo`}
            className={styles.individualImage}
          />
          {individual.photoCredit && (
            <a href={individual.photoCredit} className={styles.attribution}>
              (image attribution)
            </a>
          )}
        </div>
        <div>
          <h1 className={styles.individualName}>{individual.name}</h1>
          <div className="secondary">
            <Subhead
              individual={individual}
              associatedCompany={associatedCompany}
            />
          </div>
        </div>
      </section>
      <div className={styles.page}>
        <Contributions individualId={params.individual} />
        <div className={styles.spendingWrapper}>
          <section
            className={`${styles.spendingByPartySection} ${sharedStyles.constrainWidth}`}
          >
            <h2 id="spending-by-party">Contributions by party</h2>
            {party_summary && (
              <SpendingByParty
                partySummary={party_summary}
                labelId="spending-by-party"
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}
