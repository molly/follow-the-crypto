import { ElectionGroup, Race } from "@/app/types/Elections";
import { RaceExpenditureGroup } from "@/app/types/Expenditures";
import {
  getExpenditureRaceType,
  getSubraceName,
  isUpcoming,
} from "@/app/utils/races";
import { titlecase } from "@/app/utils/titlecase";
import { formatDate } from "@/app/utils/utils";
import CandidateExpendituresTable from "./CandidateExpendituresTable";
import RaceCandidates from "./RaceCandidates";
import styles from "./page.module.css";

function RaceDate({ race }: { race: Race }) {
  if (!("date" in race) || race.date === null) {
    return null;
  }
  const d = new Date(race.date);
  if (d < new Date()) {
    return <span>Held on {formatDate(d)}.</span>;
  } else {
    return <span>Upcoming on {formatDate(d)}.</span>;
  }
}

export default function RaceSummary({
  race,
  electionData,
  expenditures,
  upcomingRaces,
}: {
  race: Race;
  electionData: ElectionGroup;
  expenditures: RaceExpenditureGroup;
  upcomingRaces: Race[];
}) {
  const raceType = race.type;
  const relatedExpenditures = expenditures.expenditures.filter(
    (e) => getExpenditureRaceType(e) === raceType,
  );
  const candidates = race.candidates;
  const candidateSummaries = race.candidates.map(
    (c) => electionData.candidates[c.name],
  );
  const hasRelatedSpending = candidateSummaries.some(
    (c) =>
      "expenditure_races" in c &&
      c.expenditure_races &&
      c.expenditure_races.includes(race.type),
  );
  const hasSpendingInOtherRaces = candidateSummaries.filter(
    (c) => c.support_total > 0 || c.oppose_total > 0,
  );
  const isRaceUpcoming = isUpcoming(race, true) as boolean;

  let intermediateRaces;
  if (upcomingRaces.length > 1) {
    if (race.type === "general") {
      intermediateRaces = upcomingRaces.slice(1);
    }
  }

  return (
    <div className={styles.raceSummary}>
      <div className={styles.raceSummaryDetails}>
        <h3 className="no-margin">{titlecase(getSubraceName(race))}</h3>
        <RaceDate race={race} />
      </div>
      <h4>Spending by cryptocurrency-focused groups</h4>
      {!hasRelatedSpending && (
        <RaceCandidates
          candidates={candidates}
          candidateSummaries={candidateSummaries}
          electionData={electionData}
          hasSpendingInOtherRaces={hasSpendingInOtherRaces}
          isRaceUpcoming={isRaceUpcoming}
          intermediateRaces={intermediateRaces}
        />
      )}

      {hasRelatedSpending ? (
        <CandidateExpendituresTable
          candidates={candidates}
          electionData={electionData}
          relatedExpenditures={relatedExpenditures}
          isRaceUpcoming={isRaceUpcoming}
          intermediateRaces={intermediateRaces}
        />
      ) : (
        <div className={styles.noSpending}></div>
      )}
    </div>
  );
}
