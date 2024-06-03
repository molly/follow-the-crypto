import Candidate from "@/app/components/Candidate";
import { CandidateSummary } from "@/app/types/Elections";
import { formatCurrency } from "@/app/utils/utils";
import styles from "./page.module.css";

export default function CandidateResult({
  candidate,
  supportTotal,
  opposeTotal,
}: {
  candidate: CandidateSummary;
  supportTotal: number;
  opposeTotal: number;
}) {
  return (
    <>
      <Candidate
        candidate={candidate}
        candidateClassName={styles.candidate}
        candidateNameClassName={
          candidate.defeated
            ? styles.defeatedCandidateName
            : styles.activeCandidateName
        }
      />
      <div className={styles.candidateSupportOppose}>
        {supportTotal > 0 && formatCurrency(supportTotal, true)}
      </div>
      <div className={styles.candidateSupportOppose}>
        {opposeTotal > 0 && formatCurrency(opposeTotal, true)}
      </div>
      <div className={styles.notes}>
        {candidate.withdrew && `Withdrew from the race.`}
      </div>
    </>
  );
}
