import { fetchMapData } from "@/app/actions/fetch";
import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { STATES_BY_ABBR, STATES_BY_FULL } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { MapData } from "@/app/types/MapData";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase } from "@/app/utils/titlecase";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ByCommittee, { CommitteeCardContentsSkeleton } from "./ByCommittee";
import ByRace, { RaceCardContentsSkeleton } from "./ByRace";
import TotalSpending from "./TotalSpending";
import styles from "./page.module.css";

function stateNameFromUrl(urlName: string) {
  const stateName = decodeURIComponent(urlName).split("-").join(" ");
  return titlecase(stateName);
}

export function generateMetadata({
  params,
}: {
  params: { state: string };
}): Metadata {
  const state = stateNameFromUrl(params.state);
  return customMetadata({
    title: state,
    description: `Cryptocurrency-focused political action committee spending on 2024 elections in ${state}.`,
  });
}

export async function generateStaticParams() {
  const mapData = await fetchMapData();
  const data = mapData as MapData;
  const states = Object.keys(data).map((state) => {
    const stateName = STATES_BY_ABBR[state];
    return `/states/${stateName.toLowerCase().replace(" ", "-")}`;
  });
  return Object.keys(data).map((state) => {
    const stateName = STATES_BY_ABBR[state];
    return { state: stateName.toLowerCase().replace(" ", "-") };
  });
}

export default function CommitteePage({
  params,
}: {
  params: { state: string };
}) {
  const titlecasedState = stateNameFromUrl(params.state);
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
