"use client";
import { ElectionGroup } from "@/app/types/Elections";
import { RaceExpenditureGroup } from "@/app/types/Expenditures";
import Candidate from "./Candidate";
import styles from "./page.module.css";

const getFirstLastName = (name: string) => {
  let nameParts = name.split(" ");
  const firstName = nameParts[0].toUpperCase();
  const lastName = nameParts[nameParts.length - 1].toUpperCase();
  return [firstName, lastName];
};

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
        const [firstName, lastName] = getFirstLastName(candidateName);
        const candidateSummary = electionData.candidates[candidateName];
        return (
          <Candidate
            key={candidateName}
            firstName={firstName}
            lastName={lastName}
            candidate={candidateSummary}
          />
        );
      })}
    </div>
  );
}
