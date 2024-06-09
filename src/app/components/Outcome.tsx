import sharedStyles from "@/app/shared.module.css";
import { CandidateSummary, Race } from "@/app/types/Elections";
import { ExpenditureCandidateSummary } from "@/app/types/Expenditures";
import { getSubraceName, getUpcomingRaceForCandidate } from "@/app/utils/races";
import { formatDateFromString } from "@/app/utils/utils";

export default function Outcome({
  candidate,
  races,
  inSentence = false,
  withIcon = false,
}: {
  candidate: ExpenditureCandidateSummary | CandidateSummary;
  races: Race[];
  inSentence?: boolean;
  withIcon?: boolean;
}) {
  if (candidate.defeated) {
    const defeatedRace = races.find(
      (r) =>
        r.type === candidate.defeated_race &&
        r.candidates.some((c) => c.name === candidate.common_name),
    );
    const goalAccomplished = candidate.oppose_total > 0;
    let goalMark = null;
    if (withIcon) {
      if (goalAccomplished) {
        goalMark = <span className={sharedStyles.goalAccomplished}>✔</span>;
      } else {
        goalMark = <span className={sharedStyles.goalFailed}>✘</span>;
      }
    }
    return (
      <>
        {goalMark}
        <span>
          {` ${inSentence ? "was d" : "D"}efeated in the `}
          {getSubraceName(defeatedRace)}
        </span>
      </>
    );
  } else if (candidate.withdrew) {
    return ` ${inSentence ? "w" : "W"}ithdrew from the election`;
  } else {
    const nextRace = getUpcomingRaceForCandidate(races, candidate);
    if (nextRace) {
      return nextRace
        ? ` ${inSentence ? "has an u" : "U"}pcoming ${getSubraceName(nextRace)} on ${formatDateFromString(nextRace.date)}`
        : "";
    }
  }
  return null;
}
