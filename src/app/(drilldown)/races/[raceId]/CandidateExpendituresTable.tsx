import {
  CandidateSummary,
  ElectionGroup,
  RaceCandidate,
} from "@/app/types/Elections";
import { Expenditure } from "@/app/types/Expenditures";
import CandidateResult from "./CandidateResult";
import styles from "./page.module.css";

const getCandidateSupportOppose = (
  candidate: CandidateSummary,
  expenditures: Expenditure[],
) => {
  let supportTotal: number = 0;
  let opposeTotal: number = 0;
  expenditures.forEach((e: Expenditure) => {
    if (
      candidate.candidate_id &&
      e.candidate_id &&
      candidate.candidate_id.includes(e.candidate_id)
    ) {
      if (e.support_oppose_indicator === "S") {
        supportTotal += e.expenditure_amount || 0;
      } else {
        opposeTotal += e.expenditure_amount || 0;
      }
    }
  });
  return { supportTotal, opposeTotal };
};

export default function CandidatesSpending({
  candidates,
  electionData,
  relatedExpenditures,
}: {
  candidates: RaceCandidate[];
  electionData: ElectionGroup;
  relatedExpenditures: Expenditure[];
}) {
  return (
    <div className={styles.candidates}>
      <h3 className={styles.spendingHeader}>
        Spending by cryptocurrency-focused groups
      </h3>
      <>
        <span className={styles.candidateSupportHeader}>Support</span>
        <span className={styles.candidateOpposeHeader}>Oppose</span>
      </>
      {candidates.map((candidate) => {
        const candidateSummary = electionData.candidates[candidate.name];
        const { supportTotal, opposeTotal } = getCandidateSupportOppose(
          electionData.candidates[candidate.name],
          relatedExpenditures,
        );
        return (
          <CandidateResult
            key={candidate.name}
            candidate={candidateSummary}
            supportTotal={supportTotal}
            opposeTotal={opposeTotal}
          />
        );
      })}
    </div>
  );
}
