import { CandidateSummary } from "@/app/types/Elections";
import { getFirstLastName } from "@/app/utils/names";
import { ExpenditureCandidateSummary } from "../types/Expenditures";
import styles from "./candidate.module.css";
import Skeleton from "./skeletons/Skeleton";

function getPartyClass(party?: string | null) {
  if (party && party.length && ["R", "D", "L", "G", "I"].includes(party[0])) {
    return `party-${party}`;
  }
  return "party-unknown";
}

export function CandidateSkeleton({ onCard }: { onCard?: boolean }) {
  return (
    <div className={styles.candidateInfoBlock}>
      <CandidateImage />
      <Skeleton randWidth={[5, 12]} style={{ margin: 0 }} onCard={onCard} />
    </div>
  );
}

function CandidateImage({
  candidate,
  firstName,
  lastName,
  defeated,
}: {
  candidate?: CandidateSummary | ExpenditureCandidateSummary;
  firstName?: string;
  lastName?: string;
  defeated?: boolean;
}) {
  let imageUrl;
  if (firstName && lastName) {
    imageUrl = `https://storage.googleapis.com/candidates/${firstName.toLocaleLowerCase()}-${lastName.toLocaleLowerCase()}.webp`;
  }
  let candidateImageWrapperClassNames = styles.candidateImageWrapper;
  if (candidate && candidate.party) {
    candidateImageWrapperClassNames += ` ${styles[getPartyClass(candidate.party)]}`;
  } else {
    candidateImageWrapperClassNames += ` ${styles["party-loading"]}`;
  }
  if (defeated) {
    candidateImageWrapperClassNames += ` ${styles.defeatedCandidateImage}`;
  }

  let imageEl = (
    <svg className={styles.placeholderImage} viewBox="0 0 340 340">
      <g>
        <path
          fill="currentColor"
          d="m169,.5a169,169 0 1,0 2,0zm0,86a76,76 0 1 1-2,0zM57,287q27-35 67-35h92q40,0 67,35a164,164 0 0,1-226,0"
        />
        <title>Placeholder for a missing image of person.</title>
      </g>
    </svg>
  );
  if (imageUrl) {
    imageEl = (
      <object
        type="image/webp"
        data={imageUrl}
        aria-label={(candidate && candidate.common_name) || ""}
        className={styles.candidateImage}
      >
        {imageEl}
      </object>
    );
  }

  return <div className={candidateImageWrapperClassNames}>{imageEl}</div>;
}

export default function Candidate({
  candidate,
  candidateClassName,
  candidateNameClassName,
  defeated,
}: {
  candidate: CandidateSummary | ExpenditureCandidateSummary;
  candidateClassName?: string;
  candidateNameClassName?: string;
  defeated?: boolean;
}) {
  const [firstName, lastName] = getFirstLastName(candidate.common_name);

  return (
    <>
      <div
        className={`${styles.candidateInfoBlock} ${candidateClassName || ""}`}
      >
        <CandidateImage
          candidate={candidate}
          firstName={firstName}
          lastName={lastName}
          defeated={defeated}
        />
        <span>
          <span className={candidateNameClassName}>
            {candidate.common_name}
          </span>
          {candidate.party && (
            <span className="secondary"> ({candidate.party})</span>
          )}
        </span>
      </div>
    </>
  );
}
