import { ElectionGroup, Race, RaceType } from "@/app/types/Elections";
import { PopulatedRaceExpenditureGroup } from "@/app/types/Expenditures";
import { getSubraceName, isUpcomingRace } from "@/app/utils/races";
import { titlecase } from "@/app/utils/titlecase";
import { formatDateFromString, isUpcomingDate } from "@/app/utils/utils";
import CandidateExpendituresTable from "./CandidateExpendituresTable";
import RaceCandidates from "./RaceCandidates";
import styles from "./page.module.css";

function RaceDate({ race }: { race: Race }) {
  if (!("date" in race) || race.date === null) {
    return null;
  }
  if (isUpcomingDate(race.date, { inclusive: true })) {
    return <span>Upcoming on {formatDateFromString(race.date)}.</span>;
  }
  return <span>Held on {formatDateFromString(race.date)}.</span>;
}

export default function RaceSummary({
  race,
  electionData,
  expenditures,
  upcomingRaces,
}: {
  race: Race;
  electionData: ElectionGroup;
  expenditures: PopulatedRaceExpenditureGroup | null;
  upcomingRaces: Race[];
}) {
  const raceType = race.type;
  const relatedExpenditures = expenditures
    ? expenditures.expenditures.filter((e) => e.subrace === raceType)
    : [];
  const candidates = [...race.candidates].sort((a, b) => {
    const wonA = a.won === true ? 1 : 0;
    const wonB = b.won === true ? 1 : 0;
    if (wonB !== wonA) {
      return wonB - wonA;
    }
    const summaryA = electionData.candidates[a.name] || {};
    const summaryB = electionData.candidates[b.name] || {};
    const raisedA = summaryA.raised_total ?? 0;
    const raisedB = summaryB.raised_total ?? 0;
    if (raisedB !== raisedA) {
      return raisedB - raisedA;
    }
    return a.name.localeCompare(b.name);
  });
  const candidateSummaries = candidates.map(
    (c) => electionData.candidates[c.name] || {},
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
  const isRaceUpcoming = isUpcomingRace(race, true) as boolean;

  // Collect presumptive nominees by scanning upcoming primary races for
  // candidates already marked won:true (uncontested primary, deadline passed).
  const presumptiveCandidateNames = new Set<string>();
  const presumptiveParties = new Set<string>();
  if (isRaceUpcoming && race.type === RaceType.General && upcomingRaces.length > 1) {
    upcomingRaces.slice(1).forEach((primaryRace) => {
      primaryRace.candidates.forEach((c) => {
        if (c.won === true) {
          presumptiveCandidateNames.add(c.name);
          const party = c.party ?? electionData.candidates[c.name]?.party;
          if (party) {
            presumptiveParties.add(party);
          }
        }
      });
    });
  }

  let intermediateRaces;
  if (upcomingRaces.length > 1) {
    if (race.type === "general") {
      intermediateRaces = upcomingRaces.slice(1).filter(
        (r) => !r.party || !presumptiveParties.has(r.party),
      );
    }
  }

  return (
    <div className={styles.raceSummary}>
      <div className={styles.raceSummaryDetails}>
        <h3 className="no-margin">{titlecase(getSubraceName(race))}</h3>
        <RaceDate race={race} />
      </div>
      <h4>Spending by cryptocurrency-focused PACs</h4>
      {!hasRelatedSpending && (
        <RaceCandidates
          candidates={candidates}
          candidateSummaries={candidateSummaries}
          electionData={electionData}
          hasSpendingInOtherRaces={hasSpendingInOtherRaces}
          isRaceUpcoming={isRaceUpcoming}
          presumptiveCandidateNames={presumptiveCandidateNames}
          intermediateRaces={intermediateRaces}
        />
      )}

      {hasRelatedSpending ? (
        <CandidateExpendituresTable
          candidates={candidates}
          electionData={electionData}
          relatedExpenditures={relatedExpenditures}
          isRaceUpcoming={isRaceUpcoming}
          presumptiveCandidateNames={presumptiveCandidateNames}
        />
      ) : (
        <div className={styles.noSpending}></div>
      )}
    </div>
  );
}
