import { ElectionGroup, Race } from "@/app/types/Elections";
import { RaceExpenditureGroup } from "@/app/types/Expenditures";
import { humanizeList } from "@/app/utils/humanize";
import { getExpenditureRaceType, getSubraceName } from "@/app/utils/races";
import { titlecase } from "@/app/utils/titlecase";
import { formatDate } from "@/app/utils/utils";
import CandidateExpendituresTable from "./CandidateExpendituresTable";
import RaceCandidates from "./RaceCandidates";
import styles from "./page.module.css";

function RaceDate({ race }: { race: Race }) {
  if (!("date" in race)) {
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
}: {
  race: Race;
  electionData: ElectionGroup;
  expenditures: RaceExpenditureGroup;
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

  return (
    <div className={styles.raceSummaryCard}>
      <div className={styles.raceSummaryDetails}>
        <h2 className="no-margin">{titlecase(getSubraceName(race))}</h2>
        <RaceDate race={race} />
      </div>
      {!hasRelatedSpending && (
        <RaceCandidates candidates={candidateSummaries} raceType={raceType} />
      )}

      {hasRelatedSpending ? (
        <>
          <CandidateExpendituresTable
            candidates={candidates}
            electionData={electionData}
            relatedExpenditures={relatedExpenditures}
          />
        </>
      ) : (
        <div className={styles.noSpending}>
          <h3 className={styles.spendingHeader}>
            Spending by cryptocurrency-focused groups
          </h3>
          No cryptocurrency-focused groups have made expenditures pertaining to
          this specific race
          {hasSpendingInOtherRaces.length
            ? `, although they have supported ${humanizeList(hasSpendingInOtherRaces.map((c) => c.common_name))} in other races for this seat`
            : ""}
          .
        </div>
      )}
    </div>
  );
}
