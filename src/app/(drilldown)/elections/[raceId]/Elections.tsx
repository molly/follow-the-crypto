import {
  fetchStateElections,
  fetchStateExpenditures,
} from "@/app/actions/fetch";
import { CandidateSkeleton } from "@/app/components/Candidate";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { ElectionsByState } from "@/app/types/Elections";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { isUpcomingRace } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import RaceSummary from "./RaceSummary";
import styles from "./page.module.css";

export function ElectionsSkeleton() {
  return (
    <>
      {range(2).map((i) => (
        <div className={styles.raceSummary} key={`elections-skeleton-${i}`}>
          <Skeleton height="1.5rem" width="12rem" onCard={true} />
          <Skeleton
            width="15rem"
            onCard={true}
            style={{ marginBottom: "1rem" }}
          />
          <Skeleton
            width="20rem"
            onCard={true}
            style={{ marginBottom: "1rem" }}
          />
          <table className={styles.candidateExpendituresTable}>
            <thead>
              <tr>
                <th className={styles.candidateCell}></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2}>
                  <CandidateSkeleton onCard={true} />
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <CandidateSkeleton onCard={true} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
}

export default async function Elections({ raceId }: { raceId: string }) {
  const raceIdSplit = raceId.split("-");
  const shortRaceId = raceIdSplit.slice(1).join("-");
  const stateAbbr = raceIdSplit[0];

  const [expendituresData, electionsData] = await Promise.all([
    fetchStateExpenditures(stateAbbr),
    fetchStateElections(stateAbbr),
  ]);

  if (isError(electionsData)) {
    let errorText;
    if (is4xx(electionsData)) {
      errorText = (
        <span className="secondary">
          No cryptocurrency PAC spending has been recorded for this election.
        </span>
      );
    } else {
      errorText = <ErrorText subject="election data" />;
    }
    return <div className={sharedStyles.errorCardContent}>{errorText}</div>;
  }

  const expenditures =
    isError(expendituresData) && is4xx(expendituresData)
      ? null
      : (expendituresData as PopulatedStateExpenditures);
  const elections = electionsData as ElectionsByState;

  const upcomingRaces = elections[shortRaceId].races.filter((r) =>
    isUpcomingRace(r),
  );

  return elections[shortRaceId].races.map((race) => (
    <RaceSummary
      key={`${shortRaceId}-${race.type}`}
      race={race}
      electionData={elections[shortRaceId]}
      expenditures={expenditures ? expenditures.by_race[raceId] : null}
      upcomingRaces={upcomingRaces}
    />
  ));
}
