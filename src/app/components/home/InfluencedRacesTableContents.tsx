import {
  fetchAllStateElections,
  fetchCandidateExpenditures,
} from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { ElectionGroup, ElectionsByState } from "@/app/types/Elections";
import {
  ExpenditureCandidateSummary,
  ExpendituresByCandidate,
} from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { getRaceName, getSubraceName } from "@/app/utils/races";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";
import Link from "next/link";
import Candidate from "../Candidate";

function Outcome({
  candidate,
  race,
}: {
  candidate: ExpenditureCandidateSummary;
  race: ElectionGroup;
}) {
  if (candidate.defeated) {
    const defeatedRace = race.races.find(
      (r) =>
        r.type === candidate.defeated_race &&
        r.candidates.some((c) => c.name === candidate.common_name),
    );
    const goalAccomplished = candidate.oppose_total > 0;
    let goalMark = null;
    if (goalAccomplished) {
      goalMark = <span className={styles.goalAccomplished}>✔</span>;
    } else {
      goalMark = <span className={styles.goalFailed}>✘</span>;
    }
    return (
      <>
        {goalMark}
        <span> Defeated in the {getSubraceName(defeatedRace)}</span>
      </>
    );
  } else if (candidate.withdrew) {
    return "Withdrew from the election";
  } else {
    const involvedRaces = race.races.filter((r) =>
      r.candidates.some((c) => c.name === candidate.common_name),
    );
    let nextRace;
    const today = new Date().toISOString().slice(0, 10);
    for (const r of involvedRaces) {
      if (r.date >= today) {
        nextRace = r;
        break;
      }
    }
    return nextRace
      ? `Upcoming ${getSubraceName(nextRace)} on ${formatDateFromString(nextRace.date)}`
      : "";
  }
}

export async function InfluencedRacesTableContents() {
  const [expenditureData, raceData] = await Promise.all([
    fetchCandidateExpenditures(),
    fetchAllStateElections(),
  ]);
  if (isError(expenditureData) || isError(raceData)) {
    return <div>Error loading data</div>;
  }

  const { order, candidates } = expenditureData as ExpendituresByCandidate;
  const raceDetails = raceData as Record<string, ElectionsByState>;

  return order.map((candidateName) => {
    const candidate = candidates[candidateName];
    const race = raceDetails[candidate.state][candidate.race];
    const raceHref = `/races/${candidate.state}-${candidate.race}`;
    return (
      <tr className={styles.influencedTableRow} key={candidate.common_name}>
        <td>
          <Link className="unstyled" href={raceHref}>
            <Candidate candidate={candidate} />
          </Link>
        </td>
        <td className="center-cell">
          <Link className="unstyled" href={`/states/${candidate.state}`}>
            {candidate.state}
          </Link>
        </td>
        <td className="center-cell">
          <Link className="unstyled" href={raceHref}>
            {getRaceName(`${candidate.state}-${candidate.race}`)}
          </Link>
        </td>
        <td className="number-cell">
          {candidate.support_total
            ? formatCurrency(candidate.support_total, true)
            : ""}
        </td>
        <td className="number-cell">
          {candidate.oppose_total
            ? formatCurrency(candidate.oppose_total, true)
            : ""}
        </td>
        <td>
          <Outcome candidate={candidate} race={race} />
        </td>
      </tr>
    );
  });
}
