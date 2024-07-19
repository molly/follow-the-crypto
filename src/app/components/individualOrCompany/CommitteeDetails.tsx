import MaybeLink from "@/app/components/MaybeLink";
import { STATES_BY_ABBR } from "@/app/data/states";
import { RecipientDetails } from "@/app/types/Contributions";
import { getFullPartyName } from "@/app/utils/party";
import { getRaceName } from "@/app/utils/races";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import styles from "./individualOrCompany.module.css";

function isSingleCandidateCommittee(recipient: RecipientDetails) {
  if (recipient?.candidate_ids) {
    if (recipient.candidate_ids.length === 1) {
      return true;
    }
    const candidates = recipient.candidate_ids.map(
      (id) => recipient.candidate_details[id],
    );
    if (new Set(candidates.map((c) => c.name.split(", ")[0])).size === 1) {
      return true;
    }
  }
  return false;
}

function isSingleSponsorCandidateCommittee(recipient: RecipientDetails) {
  if (recipient?.sponsor_candidate_ids) {
    if (recipient.sponsor_candidate_ids.length === 1) {
      return true;
    }
    const candidates = recipient.sponsor_candidate_ids.map(
      (id) => recipient.candidate_details[id],
    );
    if (new Set(candidates.map((c) => c.name.split(", ")[0])).size === 1) {
      return true;
    }
  }
  return false;
}

function getDesignation(designation_full: string | undefined) {
  if (!designation_full || designation_full === "Unauthorized") {
    return null;
  } else if (designation_full == "Authorized by a candidate") {
    return " authorized committee";
  } else {
    return ` ${designation_full[0].toLowerCase() + designation_full.slice(1)}`;
  }
}

function CandidateCommitteeDetails({
  recipient,
  details,
}: {
  recipient: RecipientDetails;
  details: any;
}) {
  return (
    <div className={styles.committeeDetails}>
      <span className={styles.committeeDetail}>
        {details.name ? titlecaseLastFirst(details.name) : null}
        {getDesignation(recipient.designation_full)}
      </span>
      {(recipient.party || details.party) && (
        <span className={styles.committeeDetail}>
          {getFullPartyName((recipient.party || details.party)[0], false)}
        </span>
      )}
      {details.state && details.state in STATES_BY_ABBR && (
        <span className={styles.committeeDetail}>
          {STATES_BY_ABBR[details.state]}
        </span>
      )}
      {details.office && (
        <span className={styles.committeeDetail}>
          <MaybeLink href={details.race_link}>
            {getRaceName(
              `${details.state}-${details.office}-${details.district}`,
            )}
          </MaybeLink>
        </span>
      )}
    </div>
  );
}

export default function CommitteeDetails({
  recipient,
}: {
  recipient?: RecipientDetails;
}) {
  if (!recipient) {
    return null;
  }
  if (isSingleCandidateCommittee(recipient)) {
    const candidateId = (recipient.candidate_ids as string[])[0];
    const details = recipient.candidate_details?.[candidateId];
    return (
      <CandidateCommitteeDetails recipient={recipient} details={details} />
    );
  } else if (isSingleSponsorCandidateCommittee(recipient)) {
    const candidateId = (recipient.sponsor_candidate_ids as string[])[0];
    const details = recipient.candidate_details?.[candidateId];
    return (
      <CandidateCommitteeDetails recipient={recipient} details={details} />
    );
  } else if (recipient.description) {
    return (
      <div className={styles.committeeDetails}>
        <span className={styles.committeeDetail}>{recipient.description}</span>
        {recipient.party && (
          <span className={styles.committeeDetail}>
            {getFullPartyName(recipient.party[0], false)}
          </span>
        )}
        {recipient.designation_full &&
          recipient.designation_full !== "Unauthorized" && (
            <span className={styles.committeeDetail}>
              {recipient.designation_full}
            </span>
          )}
      </div>
    );
  }
}
