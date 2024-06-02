"use client";
import { ElectionGroup } from "@/app/types/Elections";
import { RaceExpenditureGroup } from "@/app/types/Expenditures";
import CandidateResult from "./CandidateResult";
import styles from "./page.module.css";

export default function RaceSummary({
  raceId,
  race,
  electionData,
}: {
  raceId: string;
  race: RaceExpenditureGroup;
  electionData: ElectionGroup;
}) {
  // Candidates, ordered by most support
  const allCandidates =
    electionData.races[electionData.races.length - 1].candidates;

  return (
    <div className={styles.candidates}>
      <>
        <span className={styles.candidateSupportHeader}>Support</span>
        <span className={styles.candidateOpposeHeader}>Oppose</span>
      </>
      {electionData.candidatesOrder.map((candidateName) => {
        const candidateSummary = electionData.candidates[candidateName];
        return (
          <CandidateResult key={candidateName} candidate={candidateSummary} />
        );
      })}
    </div>
  );
}
