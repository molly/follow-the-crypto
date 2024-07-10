import MaybeLink from "@/app/components/MaybeLink";
import { STATES_BY_ABBR } from "@/app/data/states";
import { HydratedIndividualOrCompanyContributionGroup } from "@/app/types/Contributions";
import { getFullPartyName } from "@/app/utils/party";
import { getRaceName } from "@/app/utils/races";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import styles from "./individualOrCompany.module.css";

function isSingleCandidateCommittee(
  contributionsGroup: HydratedIndividualOrCompanyContributionGroup,
) {
  if (contributionsGroup.candidate_ids) {
    if (contributionsGroup.candidate_ids.length === 1) {
      return true;
    }
    const candidates = contributionsGroup.candidate_ids.map(
      (id) => contributionsGroup.candidate_details[id],
    );
    if (new Set(candidates.map((c) => c.name.split(", ")[0])).size === 1) {
      return true;
    }
  }
  return false;
}

function isSingleSponsorCandidateCommittee(
  contributionsGroup: HydratedIndividualOrCompanyContributionGroup,
) {
  if (contributionsGroup.sponsor_candidate_ids) {
    if (contributionsGroup.sponsor_candidate_ids.length === 1) {
      return true;
    }
    const candidates = contributionsGroup.sponsor_candidate_ids.map(
      (id) => contributionsGroup.candidate_details[id],
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
  contributionsGroup,
  details,
}: {
  contributionsGroup: HydratedIndividualOrCompanyContributionGroup;
  details: any;
}) {
  return (
    <div className={styles.committeeDetails}>
      <span className={styles.committeeDetail}>
        {titlecaseLastFirst(details.name)}
        {getDesignation(contributionsGroup.designation_full)}
      </span>
      {(contributionsGroup.party || details.party) && (
        <span className={styles.committeeDetail}>
          {getFullPartyName(
            (contributionsGroup.party || details.party)[0],
            false,
          )}
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
  contributionsGroup,
}: {
  contributionsGroup: HydratedIndividualOrCompanyContributionGroup;
}) {
  if (
    contributionsGroup.committee_type_full &&
    !contributionsGroup.committee_type_full.startsWith("Party")
  ) {
    if (isSingleCandidateCommittee(contributionsGroup)) {
      const candidateId = (contributionsGroup.candidate_ids as string[])[0];
      const details = contributionsGroup.candidate_details[candidateId];
      return (
        <CandidateCommitteeDetails
          contributionsGroup={contributionsGroup}
          details={details}
        />
      );
    } else if (isSingleSponsorCandidateCommittee(contributionsGroup)) {
      const candidateId = (
        contributionsGroup.sponsor_candidate_ids as string[]
      )[0];
      const details = contributionsGroup.candidate_details[candidateId];
      return (
        <CandidateCommitteeDetails
          contributionsGroup={contributionsGroup}
          details={details}
        />
      );
    }
  }
  if (contributionsGroup.description) {
    return (
      <div className={styles.committeeDetails}>
        <span className={styles.committeeDetail}>
          {contributionsGroup.description}
        </span>
        {contributionsGroup.party && (
          <span className={styles.committeeDetail}>
            {getFullPartyName(contributionsGroup.party[0], false)}
          </span>
        )}
        {contributionsGroup.designation_full &&
          contributionsGroup.designation_full !== "Unauthorized" && (
            <span className={styles.committeeDetail}>
              {contributionsGroup.designation_full}
            </span>
          )}
      </div>
    );
  }
  return null;
}
