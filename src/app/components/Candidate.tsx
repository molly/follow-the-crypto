import { CandidateSummary } from "@/app/types/Elections";
import { getFirstLastName } from "@/app/utils/names";
import styles from "./candidate.module.css";

function getPartyClass(party?: string | null) {
  if (party && party.length && ["R", "D", "L", "G", "I"].includes(party[0])) {
    return `party-${party}`;
  }
  return "party-unknown";
}

export default function Candidate({
  candidate,
  candidateNameClass,
  defeated,
}: {
  candidate: CandidateSummary;
  candidateNameClass?: string;
  defeated?: boolean;
}) {
  const [firstName, lastName] = getFirstLastName(candidate.common_name);
  let candidateImageWrapperClassNames = `${styles.candidateImageWrapper} ${styles[getPartyClass(candidate.party)]}`;
  if (defeated) {
    candidateImageWrapperClassNames += ` ${styles.defeatedCandidateImage}`;
  }
  return (
    <>
      <div className={styles.candidateInfoBlock}>
        <div className={candidateImageWrapperClassNames}>
          <object
            type="image/webp"
            data={`https://storage.googleapis.com/candidates/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}.webp`}
            aria-label={candidate.common_name || ""}
            className={styles.candidateImage}
          >
            <svg className={styles.placeholderImage} viewBox="0 0 340 340">
              <g>
                <path
                  fill="currentColor"
                  d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1 1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
                />
                <title>Placeholder for a missing image of person.</title>
              </g>
            </svg>
          </object>
        </div>

        <span>
          <span className={candidateNameClass}>{candidate.common_name}</span>
          {candidate.party && (
            <span className="secondary"> ({candidate.party})</span>
          )}
        </span>
      </div>
    </>
  );
}
