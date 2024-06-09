"use client";
import Candidate, { UnknownCandidate } from "@/app/components/Candidate";
import {
  CandidateSummary,
  ElectionGroup,
  Race,
  RaceCandidate,
} from "@/app/types/Elections";
import { humanizeList } from "@/app/utils/humanize";
import { getSubraceName } from "@/app/utils/races";
import styles from "./page.module.css";

function NoSpendingCell({
  candidates,
  isRaceUpcoming,
  hasSpendingInOtherRaces,
}: {
  candidates: CandidateSummary[];
  isRaceUpcoming: boolean;
  hasSpendingInOtherRaces: CandidateSummary[];
}) {
  return (
    <td className={styles.noSpendingCell} rowSpan={candidates.length}>
      <span>
        {`No cryptocurrency-focused groups ${isRaceUpcoming ? "have " : ""}made expenditures
    pertaining to this specific race`}
      </span>
      {hasSpendingInOtherRaces.length > 0 && (
        <>
          <span>, although they have supported </span>
          {humanizeList(
            hasSpendingInOtherRaces.map((c) => (
              <span key={c.common_name} className="bold">
                {c.common_name}
              </span>
            )),
          )}
          <span> in other races for this seat</span>
        </>
      )}
      <span>.</span>
    </td>
  );
}

export default function RaceCandidates({
  candidates,
  candidateSummaries,
  electionData,
  hasSpendingInOtherRaces,
  isRaceUpcoming,
  intermediateRaces,
}: {
  candidates: RaceCandidate[];
  candidateSummaries: CandidateSummary[];
  electionData: ElectionGroup;
  hasSpendingInOtherRaces: CandidateSummary[];
  isRaceUpcoming: boolean;
  intermediateRaces?: Race[];
}) {
  return (
    <table className={styles.candidateExpendituresTable}>
      <thead>
        <tr>
          <th className={styles.candidateCell}></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate, ind) => {
          const summary = electionData.candidates[candidate.name];
          const defeated = "won" in candidate && candidate.won === false;
          let candidateNameClassName;
          if (defeated) {
            candidateNameClassName = styles.defeatedCandidateName;
          } else if (!isRaceUpcoming) {
            candidateNameClassName = styles.wonCandidateName;
          }
          const isLastRow =
            ind === candidates.length - 1 &&
            (!intermediateRaces || intermediateRaces.length == 0);
          return (
            <tr key={candidate.name}>
              <td
                className={`${styles.candidateCell} ${!isLastRow ? styles.candidateRow : ""}`}
              >
                <Candidate
                  candidate={summary}
                  candidateNameClassName={candidateNameClassName}
                />
              </td>
              {ind === 0 && (
                <NoSpendingCell
                  candidates={candidateSummaries}
                  isRaceUpcoming={isRaceUpcoming}
                  hasSpendingInOtherRaces={hasSpendingInOtherRaces}
                />
              )}
            </tr>
          );
        })}
        {intermediateRaces &&
          intermediateRaces.map((r) => {
            return (
              <tr key={r.type}>
                <td className={styles.candidateCell}>
                  <UnknownCandidate
                    party={r.party}
                    name={`${getSubraceName(r)} winner`}
                  />
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
