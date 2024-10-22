import {
  fetchAllStateElections,
  fetchBeneficiaries,
  fetchBeneficiariesWithoutExpendituresOrder,
} from "@/app/actions/fetch";
import Candidate from "@/app/components/Candidate";
import ErrorText from "@/app/components/ErrorText";
import InformationalTooltip from "@/app/components/InformationalTooltip";
import Outcome from "@/app/components/Outcome";
import styles from "@/app/components/tables.module.css";
import { SINGLE_MEMBER_STATES, STATES_BY_ABBR } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { Beneficiary, CandidateBeneficiary } from "@/app/types/Beneficiaries";
import { RecipientCandidateDetails } from "@/app/types/Contributions";
import { CandidateSummary, ElectionsByState } from "@/app/types/Elections";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";

function getRaceId(candidateDetails: RecipientCandidateDetails): string {
  if (candidateDetails.office === "P") {
    return "P";
  } else if (candidateDetails.office === "S") {
    return `${candidateDetails.state}-S`;
  } else if (candidateDetails.office === "H") {
    let id = `${candidateDetails.state}-H`;
    if (!SINGLE_MEMBER_STATES.includes(candidateDetails.state)) {
      id += `-${candidateDetails.district}`;
    }
    return id;
  }
  return "";
}

function getShortRaceId(candidateDetails: RecipientCandidateDetails): string {
  if (candidateDetails.office === "P") {
    return "P";
  } else if (candidateDetails.office === "S") {
    return "S";
  } else if (candidateDetails.office === "H") {
    let id = "H";
    if (!SINGLE_MEMBER_STATES.includes(candidateDetails.state)) {
      id += `-${candidateDetails.district}`;
    }
    return id;
  }
  return "";
}

function GoalOutcome({ candidate }: { candidate: CandidateSummary }) {
  if (candidate.defeated || candidate.withdrew) {
    const verb = candidate.defeated ? "lost" : "withdrew from";
    return (
      <svg
        className={sharedStyles.goalFailed}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        <title>Goal failed</title>
      </svg>
    );
  }
  return null;
}

function CandidateRow({
  beneficiary,
  stateElections,
  id,
}: {
  beneficiary: CandidateBeneficiary;
  stateElections?: ElectionsByState;
  id: string;
}) {
  const candidateDetails = beneficiary.candidate_details;
  const raceId = getRaceId(candidateDetails);
  const raceHref = `/elections/${raceId === "P" ? "president" : raceId}`;
  const raceName = getRaceName(raceId);
  let election;
  let electionCandidate;
  if (raceId !== "presidential") {
    election = stateElections?.[getShortRaceId(candidateDetails)];
    if (election) {
      electionCandidate = Object.values(election.candidates).find(
        (c) => c.candidate_id === id,
      );
    }
  }

  return (
    <tr className={styles.influencedTableRow} key={id}>
      <td className="text-cell">
        {electionCandidate ? (
          <Link className="unstyled" href={raceHref}>
            <Candidate candidateSummary={electionCandidate} />
          </Link>
        ) : (
          <>
            <span>
              {titlecaseLastFirst(beneficiary.candidate_details.name)}
            </span>
            <span>{id}</span>
          </>
        )}
      </td>
      <td className="center-cell">
        {candidateDetails.office !== "P" && (
          <Link
            className="unstyled"
            href={`/states/${STATES_BY_ABBR[candidateDetails.state].replaceAll(" ", "-").toLowerCase()}`}
          >
            {candidateDetails.state}
          </Link>
        )}
      </td>
      <td className="center-cell">
        <Link className="unstyled" href={raceHref}>
          {raceName}
        </Link>
      </td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
      <td className="small-cell center-cell">
        {electionCandidate && <GoalOutcome candidate={electionCandidate} />}
      </td>
      <td className="text-cell">
        {election && electionCandidate && (
          <Outcome candidate={electionCandidate} races={election.races} />
        )}
      </td>
    </tr>
  );
}

async function OtherSupportedRacesContents() {
  const [beneficiariesData, beneficiariesOrder, electionsData] =
    await Promise.all([
      fetchBeneficiaries(),
      fetchBeneficiariesWithoutExpendituresOrder(),
      fetchAllStateElections(),
    ]);
  if (
    isError(beneficiariesData) ||
    isError(beneficiariesOrder) ||
    isError(electionsData)
  ) {
    return (
      <tr>
        <td colSpan={6}>
          <ErrorText subject="other contributions" />
        </td>
      </tr>
    );
  }
  const elections = electionsData as Record<string, ElectionsByState>;
  const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
  const order = beneficiariesOrder as string[];

  return order
    .filter(
      (id) =>
        !id.startsWith("C") &&
        (beneficiaries[id] as CandidateBeneficiary).candidate_details
          .isRunningThisCycle,
    )
    .map((id) => {
      const beneficiary = beneficiaries[id] as CandidateBeneficiary;
      const state = beneficiary.candidate_details.state;
      return (
        <CandidateRow
          key={id}
          beneficiary={beneficiary}
          stateElections={elections[state]}
          id={id}
        />
      );
    });
}

export default function OtherSupportedRaces() {
  return (
    <div className={styles.influencedCard}>
      <div className={styles.tableCardContent}>
        <h2>
          Other races where cryptocurrency companies and executives have
          contributed
        </h2>
      </div>
      <table className={styles.influencedTable}>
        <thead className={styles.inheritBorderRadius}>
          <tr className={styles.influencedTableHeader}>
            <th className="text-cell">Candidate</th>
            <th className="center-cell">State</th>
            <th className="center-cell">Office</th>
            <th className="number-cell small-cell">
              Total industry contributions
            </th>
            <th className="small-cell center-cell">
              Goal{" "}
              <span className="no-wrap">
                achieved?
                <InformationalTooltip>
                  <span>
                    The PACs&rsquo; goal is considered to have been achieved if
                    a candidate they supported won their election, or if a
                    candidate they opposed lost.
                  </span>
                </InformationalTooltip>
              </span>
            </th>
            <th className="long-text-cell">Outcome</th>
          </tr>
        </thead>
        <tbody className={styles.inheritBorderRadius}>
          <OtherSupportedRacesContents />
        </tbody>
      </table>
    </div>
  );
}
