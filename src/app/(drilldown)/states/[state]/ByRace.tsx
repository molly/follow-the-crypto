import { fetchStateElections } from "@/app/actions/fetch";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { Expenditures } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { sortRaces } from "@/app/utils/races";
import { getRandomInt, range } from "@/app/utils/range";
import { formatCurrency, humanizeNumber } from "@/app/utils/utils";
import Link from "next/link";
import { Suspense } from "react";
import RaceSummary from "./RaceSummary";
import styles from "./page.module.css";

import { ElectionsByState } from "@/app/types/Elections";
import { titlecase } from "@/app/utils/titlecase";

const getRaceName = (raceId: string) => {
  const raceParts = raceId.split("-");
  if (raceParts[1] === "S") {
    return "Senate";
  } else if (raceParts[1] === "H") {
    return `House District ${parseInt(raceParts[2], 10)}`;
  }
};

async function RaceCardContents({
  expenditures,
  stateAbbr,
}: {
  expenditures: Expenditures;
  stateAbbr: string;
}) {
  const data = await fetchStateElections(stateAbbr);
  const races = Object.keys(expenditures.by_race).sort(sortRaces);

  if (isError(data)) {
    return <div>Something went wrong when fetching election data.</div>;
  }

  const electionData = data as ElectionsByState;
  return (
    <>
      {races.map(async (raceId) => {
        const race = expenditures.by_race[raceId];
        const shortId = raceId.split("-").slice(1).join("-");
        const involvedCommittees = new Set(
          race.expenditures.map((exp) => exp.committee_id),
        );

        return (
          <div key={raceId} className={styles.cardSection}>
            <Link href={`/race/${raceId}`}>
              <h3>{getRaceName(raceId)}</h3>
            </Link>
            <span>
              {`${titlecase(humanizeNumber(involvedCommittees.size))} cryptocurrency-focused committee${involvedCommittees.size > 1 ? "s have spent a combined" : " has spent"} ${formatCurrency(race.total, true)} on this race.`}
            </span>
            {isError(data) ? (
              <div>Something went wrong fetching election data.</div>
            ) : (
              <RaceSummary
                raceId={raceId}
                race={expenditures.by_race[raceId]}
                electionData={electionData[shortId]}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

function RaceCardContentsSkeleton() {
  return (
    <>
      {range(getRandomInt(2, 4)).map((i) => (
        <div key={`race-skeleton-${i}`} className={styles.cardSection}>
          <Skeleton randWidth={[5, 10]} height="1.17em" />
          {range(getRandomInt(2, 6)).map((j) => (
            <Skeleton key={`race-skeleton-${i}-${j}`} randWidth={[5, 8]} />
          ))}
        </div>
      ))}
    </>
  );
}

export default async function ByRace({
  expenditures,
  stateAbbr,
}: {
  expenditures: Expenditures;
  stateAbbr: string;
}) {
  return (
    <div className={styles.raceCard}>
      <h2>By race</h2>
      <Suspense fallback={<RaceCardContentsSkeleton />}>
        <RaceCardContents expenditures={expenditures} stateAbbr={stateAbbr} />
      </Suspense>
    </div>
  );
}
