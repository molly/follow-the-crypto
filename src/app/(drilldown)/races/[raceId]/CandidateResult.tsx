import Candidate from "@/app/components/Candidate";
import { CandidateSummary } from "@/app/types/Elections";
import { formatCurrency } from "@/app/utils/utils";
import styles from "./page.module.css";

export default function CandidateResult({
  candidate,
  supportTotal,
  opposeTotal,
  rowClass,
}: {
  candidate: CandidateSummary;
  supportTotal: number;
  opposeTotal: number;
  rowClass?: string;
}) {
  return (
    <tr className={rowClass}>
      <td className={styles.candidateCell}>
        <Candidate
          candidate={candidate}
          candidateClassName={styles.candidate}
          candidateNameClassName={
            candidate.defeated
              ? styles.defeatedCandidateName
              : styles.activeCandidateName
          }
        />
      </td>
      <td className="number-cell">
        {supportTotal > 0 && formatCurrency(supportTotal, true)}
      </td>
      <td className="number-cell">
        {opposeTotal > 0 && formatCurrency(opposeTotal, true)}
      </td>
      <td>{candidate.withdrew && `Withdrew from the race.`}</td>
    </tr>
  );
}
