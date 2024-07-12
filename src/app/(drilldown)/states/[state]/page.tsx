import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { STATES_BY_FULL } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { titlecase } from "@/app/utils/titlecase";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ByCommittee, { CommitteeCardContentsSkeleton } from "./ByCommittee";
import ByRace, { RaceCardContentsSkeleton } from "./ByRace";
import TotalSpending from "./TotalSpending";
import styles from "./page.module.css";

export function generateMetadata({
  params,
}: {
  params: { state: string };
}): Metadata {
  const state = titlecase(params.state.split("-").join(" "));
  return {
    title: `${state} | Follow the Crypto`,
    description: `Cryptocurrency-focused political action committee spending on 2024 elections in ${state}.`,
  };
}

export default function CommitteePage({
  params,
}: {
  params: { state: string };
}) {
  const titlecasedState = titlecase(params.state.split("-").join(" "));
  if (!(titlecasedState in STATES_BY_FULL)) {
    notFound();
  }

  const stateAbbr = STATES_BY_FULL[titlecasedState];

  return (
    <div className={styles.page}>
      <h1 className={sharedStyles.titleH2}>{titlecasedState}</h1>
      <Suspense
        fallback={<MoneyCardSkeleton className={styles.totalSpendingCard} />}
      >
        <TotalSpending
          stateAbbr={stateAbbr}
          titlecasedState={titlecasedState}
        />
      </Suspense>
      <div className={styles.raceAndCommitteeSection}>
        <div className={styles.raceCard}>
          <h2>By race</h2>
          <Suspense fallback={<RaceCardContentsSkeleton />}>
            <ByRace stateAbbr={stateAbbr} />
          </Suspense>
        </div>
        <div className={styles.committeeCard}>
          <h2>By group</h2>
          <Suspense fallback={<CommitteeCardContentsSkeleton />}>
            <ByCommittee stateAbbr={stateAbbr} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
