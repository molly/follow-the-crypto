import { CandidateSummary } from "@/app/types/Elections";
import { formatCurrency } from "@/app/utils/utils";
import styles from "./page.module.css";

function getPartyClass(party?: string | null) {
  if (party && party.length && ["R", "D", "L", "G", "I"].includes(party[0])) {
    return `party-${party}`;
  }
  return "party-unknown";
}

export default function Candidate({
  candidate,
  firstName,
  lastName,
}: {
  candidate: CandidateSummary;
  firstName: string;
  lastName: string;
}) {
  let infoBlockClassNames = `${styles.candidateInfoBlock} ${styles[getPartyClass(candidate.party)]}`;
  return (
    <>
      <div className={infoBlockClassNames}>
        <object
          type="image/webp"
          data={`https://storage.googleapis.com/candidates/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}.webp`}
          width="50"
          height="50"
          aria-label={candidate.common_name || ""}
          className={styles.candidateImage}
        >
          <svg className={styles.placeholderImage} viewBox="0 0 340 340">
            <path
              fill="currentColor"
              d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1 1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
            />
            <title>Placeholder for a missing image of person.</title>
          </svg>
        </object>

        <span>
          <span
            className={
              candidate.defeated
                ? styles.defeatedCandidateName
                : styles.activeCandidateName
            }
          >
            {candidate.common_name}
          </span>
          {candidate.party && (
            <span className="secondary"> ({candidate.party})</span>
          )}
        </span>
      </div>
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
          `Defeated in the ${candidate.defeated_race.replace("_", " ")} election.`}
      </div>
    </>
  );
}
