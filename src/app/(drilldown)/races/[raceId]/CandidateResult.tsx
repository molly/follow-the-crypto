import Candidate from "@/app/components/Candidate";
import { CandidateSummary } from "@/app/types/Elections";
import { formatCurrency } from "@/app/utils/utils";
import styles from "./page.module.css";

function getPartyClass(party?: string | null) {
  if (party && party.length && ["R", "D", "L", "G", "I"].includes(party[0])) {
    return `party-${party}`;
  }
  return "party-unknown";
}

export default function CandidateResult({
  candidate,
}: {
  candidate: CandidateSummary;
}) {
  let infoBlockClassNames = `${styles.candidateInfoBlock} ${styles[getPartyClass(candidate.party)]}`;
  return (
    <>
      <Candidate
        candidate={candidate}
        candidateNameClass={
          candidate.defeated
            ? styles.defeatedCandidateName
            : styles.activeCandidateName
        }
      />
      <div className={styles.candidateSupportOppose}>
        {candidate.support_total > 0 &&
          formatCurrency(candidate.support_total, true)}
      </div>
      <div className={styles.candidateSupportOppose}>
        {candidate.oppose_total > 0 &&
          formatCurrency(candidate.oppose_total, true)}
      </div>
      <div className={styles.notes}>
        {candidate.withdrew && `Withdrew from the race.`}
        {!candidate.withdrew &&
          candidate.defeated &&
          candidate.defeated_race &&
          `Defeated in the ${candidate.defeated_race.replace("_", " ")} election.`}
      </div>
    </>
  );
}
