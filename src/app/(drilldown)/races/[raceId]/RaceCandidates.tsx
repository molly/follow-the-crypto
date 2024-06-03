import Candidate from "@/app/components/Candidate";
import { CandidateSummary, RaceType } from "@/app/types/Elections";
import styles from "./page.module.css";

export default function RaceCandidates({
  raceType,
  candidates,
}: {
  raceType: RaceType;
  candidates: CandidateSummary[];
}) {
  return (
    <div className={styles.raceCandidates}>
      {candidates.map((candidate) => {
        const defeated =
          candidate.defeated && candidate.defeated_race === raceType;
        return (
          <Candidate
            key={candidate.common_name}
            candidate={candidate}
            candidateNameClassName={
              defeated
                ? styles.defeatedCandidateName
                : styles.activeCandidateName
            }
          />
        );
      })}
    </div>
  );
}
