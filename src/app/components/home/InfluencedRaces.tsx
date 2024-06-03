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

function CandidateRow({
  candidate,
  race,
}: {
  candidate: ExpenditureCandidateSummary;
  race: ElectionGroup;
  navigateToRace: () => (raceId: string) => void;
}) {
  const raceHref = `/races/${candidate.state}-${candidate.race}`;
  return (
    <tr className={styles.influencedTableRow}>
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
}

export async function InfluencedRaces() {
  const [expenditureData, raceData] = await Promise.all([
    fetchCandidateExpenditures(),
    fetchAllStateElections(),
  ]);
  if (isError(expenditureData) || isError(raceData)) {
    return <div>Error loading data</div>;
  }

  const { order, candidates } = expenditureData as ExpendituresByCandidate;
  const raceDetails = raceData as Record<string, ElectionsByState>;

  return (
    <div className={styles.influencedCard}>
      These super PACs and other cryptocurrency-funded groups have already spent
      heavily to influence the outcome of multiple Congressional races.
      <h2>Races influenced by crypto industry money</h2>
      <div className={styles.influencedTableWrapper}>
        <table className={styles.influencedTable}>
          <thead>
            <tr>
              <th className="text-cell">Candidate</th>
              <th className="center-cell">State</th>
              <th className="center-cell">Office</th>
              <th className="number-cell">Support</th>
              <th className="number-cell">Oppose</th>
              <th className="text-cell">Outcome</th>
            </tr>
          </thead>
          <tbody>
            {order.map((candidateName) => {
              const candidate = candidates[candidateName];
              return (
                <CandidateRow
                  key={candidateName}
                  candidate={candidate}
                  race={raceDetails[candidate.state][candidate.race]}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
