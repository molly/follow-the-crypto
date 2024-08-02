import { CandidateSummary, Race } from "@/app/types/Elections";
import { ExpenditureCandidateSummary } from "@/app/types/Expenditures";
import { getSubraceName, getUpcomingRaceForCandidate } from "@/app/utils/races";
import { formatDateFromString, isUpcomingDate } from "@/app/utils/utils";

export default function Outcome({
  candidate,
  races,
  inSentence = false,
}: {
  candidate: ExpenditureCandidateSummary | CandidateSummary;
  races: Race[];
  inSentence?: boolean;
}) {
  if (candidate.defeated) {
    const defeatedRace = races.find(
      (r) =>
        r.type === candidate.defeated_race &&
        r.candidates.some((c) => c.name === candidate.common_name),
    );
    return (
      <>
        {`${inSentence ? " was d" : "D"}efeated in the `}
        {getSubraceName(defeatedRace)}
      </>
    );
  } else if (candidate.withdrew) {
    return `${inSentence ? " w" : "W"}ithdrew from the election`;
  } else {
    const nextRace = getUpcomingRaceForCandidate(races, candidate);
    if (nextRace) {
      if (isUpcomingDate(nextRace.date, { inclusive: true })) {
        return `${inSentence ? " has an u" : "U"}pcoming ${getSubraceName(nextRace)} on ${formatDateFromString(nextRace.date)}`;
      } else {
        // Edge case where election date may have passed, but results have not yet become available.
        return `${inSentence ? " is a" : "A"}waiting results from the ${getSubraceName(nextRace)} on ${formatDateFromString(nextRace.date)}`;
      }
    }
  }
  return null;
}
