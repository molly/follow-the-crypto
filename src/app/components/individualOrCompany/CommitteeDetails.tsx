import MaybeLink from "@/app/components/MaybeLink";
import { STATES_BY_ABBR } from "@/app/data/states";
import {
  RecipientCandidateDetails,
  RecipientDetails,
} from "@/app/types/Contributions";
import { humanizeList } from "@/app/utils/humanize";
import { getFullPartyName } from "@/app/utils/party";
import { getRaceName } from "@/app/utils/races";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import { ReactElement } from "react";
import styles from "./individualOrCompany.module.css";

function getUniqueCandidateIds(recipient: RecipientDetails) {
  // If a candidate has run for multiple offices, sometimes they end up duplicated in candidate_ids
  // There is an edge case here where two different candidates could have the same last name AND
  // they've formed a committee together, but this is rare enough that it's probably acceptable to
  // ignore for now.
  if (!recipient.candidate_ids) {
    return [];
  }
  const lastNameMap = new Map<string, string>();
  for (const candidateId of recipient.candidate_ids) {
    const candidate = recipient.candidate_details[candidateId];
    if (candidate && candidate.name) {
      const lastName = candidate.name.split(", ")[0];
      const existing = lastNameMap.get(lastName);
      if (!existing) {
        lastNameMap.set(lastName, candidateId);
      } else {
        const existingCandidate = recipient.candidate_details[existing];
        const existingMax = Math.max(
          ...(existingCandidate.election_years ?? [0]),
        );
        const currentMax = Math.max(...(candidate.election_years ?? [0]));
        if (currentMax > existingMax) {
          lastNameMap.set(lastName, candidateId);
        }
      }
    }
  }
  return Array.from(lastNameMap.values());
}

function isSingleCandidateCommittee(
  recipient: RecipientDetails,
  nonCandidateCommittees: Set<string>,
) {
  if (nonCandidateCommittees.has(recipient.committee_id)) {
    return false;
  }
  if (recipient?.candidate_ids) {
    if (recipient.candidate_ids.length === 1) {
      return true;
    }
    const uniqueCandidateIds = getUniqueCandidateIds(recipient);
    if (uniqueCandidateIds.length === 1) {
      return true;
    }
  }
  return false;
}

function isMultiCandidateCommittee(
  recipient: RecipientDetails,
  nonCandidateCommittees: Set<string>,
) {
  if (nonCandidateCommittees.has(recipient.committee_id)) {
    return false;
  }
  if (recipient?.candidate_ids && recipient.candidate_ids.length > 1) {
    const candidates = recipient.candidate_ids.map(
      (id) => recipient.candidate_details[id],
    );
    if (
      new Set(candidates.map((c) => !c || !c.name || c.name.split(", ")[0]))
        .size > 1
    ) {
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

function CandidateStateAndOffice({
  details,
}: {
  details: RecipientCandidateDetails;
}) {
  if (
    (!details.state || !(details.state in STATES_BY_ABBR)) &&
    details.office
  ) {
    return (
      <MaybeLink href={details.race_link}>
        {STATES_BY_ABBR[details.state]}{" "}
        {getRaceName(`${details.state}-${details.office}-${details.district}`)}
      </MaybeLink>
    );
  } else if (
    details.state &&
    details.state in STATES_BY_ABBR &&
    !details.office
  ) {
    return (
      <span className={styles.committeeDetail}>
        {details.state && details.state in STATES_BY_ABBR && (
          <span className={styles.committeeDetail}>
            {STATES_BY_ABBR[details.state]}
          </span>
        )}
      </span>
    );
  }
  return (
    <span className={styles.committeeDetail}>
      <MaybeLink href={details.race_link}>
        {STATES_BY_ABBR[details.state]}{" "}
        {getRaceName(`${details.state}-${details.office}-${details.district}`)}
      </MaybeLink>
    </span>
  );
}

function CandidateCommitteeDetails({
  recipient,
  details,
}: {
  recipient: RecipientDetails;
  details: RecipientCandidateDetails;
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
      <CandidateStateAndOffice details={details} />
    </div>
  );
}

function MultiCandidateCommitteeDetails({
  recipient,
}: {
  recipient: RecipientDetails;
}) {
  const uniqueCandidateIds = getUniqueCandidateIds(recipient);
  const uniqueCandidates = uniqueCandidateIds.map(
    (id) => recipient.candidate_details[id],
  );

  const parties = new Set<string>();
  const names: string[] = [];
  const races: ReactElement[] = [];
  for (const c of uniqueCandidates) {
    if (c.party) {
      parties.add(c.party);
    }
    if (c.name) {
      names.push(titlecaseLastFirst(c.name));
    }
    if (c.state && c.office) {
      races.push(
        <MaybeLink href={c.race_link} key={c.name}>
          {`${STATES_BY_ABBR[c.state]} ${getRaceName(`${c.state}-${c.office}-${c.district}`)}`}
        </MaybeLink>,
      );
    }
  }
  const party = parties.size === 1 ? parties.values().next().value : undefined;

  return (
    <div className={styles.committeeDetails}>
      <span className={styles.committeeDetail}>
        {humanizeList(names as string[])}
        {getDesignation(recipient.designation_full)}
      </span>
      {party && (
        <span className={styles.committeeDetail}>
          {getFullPartyName(party[0], false)}
        </span>
      )}
      {races && (
        <span className={styles.committeeDetail}>{humanizeList(races)}</span>
      )}
    </div>
  );
}

export default function CommitteeDetails({
  recipient,
  nonCandidateCommittees = new Set(),
}: {
  recipient?: RecipientDetails;
  nonCandidateCommittees?: Set<string>;
}) {
  if (!recipient) {
    return null;
  }
  if (isSingleCandidateCommittee(recipient, nonCandidateCommittees)) {
    const candidateId = (recipient.candidate_ids as string[])[0];
    const details = recipient.candidate_details?.[candidateId];
    return (
      <CandidateCommitteeDetails recipient={recipient} details={details} />
    );
  } else if (isMultiCandidateCommittee(recipient, nonCandidateCommittees)) {
    return <MultiCandidateCommitteeDetails recipient={recipient} />;
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
