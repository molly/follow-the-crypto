import {
  fetchStateElections,
  fetchStateExpenditures,
} from "@/app/actions/fetch";
import { STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { ElectionsByState } from "@/app/types/Elections";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { getRaceName, isUpcomingRace } from "@/app/utils/races";
import type { Metadata } from "next";
import Ads from "./Ads";
import RaceSummary from "./RaceSummary";
import Spending from "./Spending";
import styles from "./page.module.css";

export async function generateMetadata({
  params,
}: {
  params: { raceId: string };
}): Promise<Metadata> {
  const state = params.raceId.split("-")[0];
  return {
    title: `${STATES_BY_ABBR[state]} ${getRaceName(params.raceId)} election | Follow the Crypto`,
  };
}

export default async function RacePage({
  params,
}: {
  params: { raceId: string };
}) {
  const raceIdSplit = params.raceId.split("-");
  const shortRaceId = raceIdSplit.slice(1).join("-");
  const stateAbbr = raceIdSplit[0];

  let expendituresData = await fetchStateExpenditures(stateAbbr);
  const electionsData = await fetchStateElections(stateAbbr);

  if (isError(expendituresData) || isError(electionsData)) {
    if (is4xx(expendituresData) && is4xx(electionsData)) {
      return (
        <div className={sharedStyles.smallCard}>
          No spending has been recorded in this state.
        </div>
      );
    }
    return <div>Something went wrong when getting expenditure data.</div>;
  }

  const expenditures = expendituresData as PopulatedStateExpenditures;
  const elections = electionsData as ElectionsByState;
  const upcomingRaces = elections[shortRaceId].races.filter((r) =>
    isUpcomingRace(r),
  );

  return (
    <>
      <div className={styles.columns}>
        <div className={styles.headerWrapper}>
          <h1 className="margin-0">{`${STATES_BY_ABBR[stateAbbr]} ${getRaceName(params.raceId)} election`}</h1>
        </div>
        <div className={styles.electionsColumn}>
          <h2 className={styles.electionsColumnHeader}>Elections</h2>
          {elections[shortRaceId].races.map((race) => (
            <RaceSummary
              key={`${shortRaceId}-${race.type}`}
              race={race}
              electionData={elections[shortRaceId]}
              expenditures={expenditures.by_race[params.raceId]}
              upcomingRaces={upcomingRaces}
            />
          ))}
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.spendingCard}>
            <h2 className={styles.spendingHeader}>Spending</h2>
            <Spending election={elections[shortRaceId]} />
          </div>
          <div className={styles.adsCard}>
            <h2 className={styles.adsHeader}>Ads</h2>
            <Ads raceId={params.raceId} />
          </div>
        </div>
      </div>
    </>
  );
}
