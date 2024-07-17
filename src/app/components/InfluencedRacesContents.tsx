import {
  fetchAllStateElections,
  fetchCandidateExpenditures,
} from "@/app/actions/fetch";
import styles from "@/app/components/tables.module.css";
import sharedStyles from "@/app/shared.module.css";
import { ElectionGroup, ElectionsByState } from "@/app/types/Elections";
import {
  ExpenditureCandidateSummary,
  ExpendituresByCandidate,
} from "@/app/types/Expenditures";
import { ErrorType, isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { STATES_BY_ABBR } from "../data/states";
import Candidate, { CandidateSkeleton } from "./Candidate";
import ErrorText from "./ErrorText";
import InformationalTooltip from "./InformationalTooltip";
import Outcome from "./Outcome";
import Skeleton from "./skeletons/Skeleton";

const renderPlaintextSpending = (candidate: ExpenditureCandidateSummary) => {
  const support = candidate.support_total
    ? `${formatCurrency(candidate.support_total, true)} to support`
    : null;
  const oppose = candidate.oppose_total
    ? `${formatCurrency(candidate.oppose_total, true)} to oppose`
    : null;
  return [support, oppose].filter(Boolean).join(" and ");
};

function InfluencedRacesContentsSkeleton({ fullPage }: { fullPage: boolean }) {
  return range(fullPage ? 20 : 5).map((i) => (
    <div key={`influenced-race-skeleton-${i}`} className={styles.influencedRow}>
      <CandidateSkeleton onCard={true} />
      <Skeleton
        onCard={true}
        width="15rem"
        style={{ marginBottom: 0, marginLeft: "0.5rem" }}
      />
    </div>
  ));
}

function GoalOutcome({
  candidate,
  explanatoryText = false,
}: {
  candidate: ExpenditureCandidateSummary;
  explanatoryText?: boolean;
}) {
  const wasOpposed = candidate.oppose_total > 0;
  const wasSupported = candidate.support_total > 0;
  let icon = null;
  let text = null;

  if (candidate.defeated || candidate.withdrew) {
    const verb = candidate.defeated ? "lost" : "withdrew from";
    if (wasOpposed) {
      if (wasSupported) {
        icon = (
          <svg
            className={`${sharedStyles.goalMixed} ${explanatoryText ? sharedStyles.goalInline : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <title>
              Mixed results (this candidate received both support and opposition
              from crypto PACs)
            </title>
            <path d="M32 288c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L32" />
          </svg>
        );
        text = `Candidate both supported and opposed by crypto PACs ${verb} their race`;
      } else {
        icon = (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className={`${sharedStyles.goalAccomplished} ${explanatoryText ? sharedStyles.goalInline : ""}`}
            role="image"
          >
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
            <title>Goal achieved</title>
          </svg>
        );
        text = `Candidate opposed by crypto PACs ${verb} their race`;
      }
    } else {
      icon = (
        <svg
          className={`${sharedStyles.goalFailed} ${explanatoryText ? sharedStyles.goalInline : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          <title>Goal failed</title>
        </svg>
      );
      text = `Candidate supported by crypto PACs ${verb} their race`;
    }
  }

  if (!icon) {
    return null;
  }

  if (explanatoryText) {
    return (
      <>
        <div className={styles.goalIconWrapper}>{icon}</div>
        {text}
      </>
    );
  } else {
    return icon;
  }
}

function CandidateRow({
  candidate,
  race,
  small,
}: {
  candidate: ExpenditureCandidateSummary;
  race: ElectionGroup;
  small?: boolean;
}) {
  const raceHref = `/elections/${candidate.state}-${candidate.race}`;
  const raceName = getRaceName(`${candidate.state}-${candidate.race}`);
  if (!small) {
    return (
      <tr className={styles.influencedTableRow} key={candidate.common_name}>
        <td className="text-cell">
          <Link className="unstyled" href={raceHref}>
            <Candidate candidateSummary={candidate} />
          </Link>
        </td>
        <td className="center-cell">
          <Link
            className="unstyled"
            href={`/states/${STATES_BY_ABBR[candidate.state].replaceAll(" ", "-").toLowerCase()}`}
          >
            {candidate.state}
          </Link>
        </td>
        <td className="center-cell">
          <Link className="unstyled" href={raceHref}>
            {raceName}
          </Link>
        </td>
        <td className="number-cell">
          {candidate.support_total
            ? formatCurrency(candidate.support_total, true)
            : ""}
        </td>
        <td className="number-cell">
          {candidate.oppose_total
            ? formatCurrency(candidate.oppose_total, true)
            : ""}
        </td>
        <td className="small-cell center-cell">
          <GoalOutcome candidate={candidate} />
        </td>
        <td className="text-cell">
          <Outcome candidate={candidate} races={race.races} />
        </td>
      </tr>
    );
  } else {
    const goalOutcome = (
      <GoalOutcome candidate={candidate} explanatoryText={true} />
    );
    return (
      <div key={candidate.common_name} className={styles.influencedRow}>
        <Candidate candidateSummary={candidate} imageOnly={true} />
        <div>
          {`${renderPlaintextSpending(candidate)} ${candidate.common_name} for `}
          <Link
            href={raceHref}
          >{`${STATES_BY_ABBR[candidate.state]} ${raceName}`}</Link>
          .
          <div className={styles.influencedRowOutcome}>
            <Outcome candidate={candidate} races={race.races} />
            {goalOutcome && (
              <div className={styles.goalOutcomeRow}>{goalOutcome}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default function InfluencedRacesContents({
  fullPage = false,
  small = false,
}: {
  fullPage?: boolean;
  small?: boolean;
}) {
  const [expenditures, setExpenditures] = useState<
    ExpendituresByCandidate | ErrorType
  >({
    order: [],
    candidates: {},
  });
  const [raceDetailsData, setRaceDetails] = useState<
    Record<string, ElectionsByState> | ErrorType | null
  >();

  useEffect(() => {
    (async function () {
      const [expenditureData, raceData] = await Promise.all([
        fetchCandidateExpenditures(),
        fetchAllStateElections(),
      ]);
      setExpenditures(expenditureData);
      setRaceDetails(raceData);
    })();
  }, []);

  if (!expenditures || !raceDetailsData) {
    return <InfluencedRacesContentsSkeleton fullPage={fullPage} />;
  }

  if (isError(expenditures) || isError(raceDetailsData)) {
    return (
      <div className={sharedStyles.errorCardContentStandalone}>
        <ErrorText subject="the list of races" />
      </div>
    );
  }

  const { order, candidates } = expenditures as ExpendituresByCandidate;
  const raceDetails = raceDetailsData as Record<string, ElectionsByState>;
  let rows = order;
  if (!fullPage) {
    rows = order.slice(0, 5);
  }

  const contents = rows.map((candidateName) => {
    const candidate = candidates[candidateName];
    return (
      <CandidateRow
        key={candidateName}
        candidate={candidate}
        race={raceDetails[candidate.state][candidate.race]}
        small={small}
      />
    );
  });

  if (small) {
    return <div className={styles.influencedList}>{contents}</div>;
  }
  return (
    <table className={styles.influencedTable}>
      <thead className={styles.inheritBorderRadius}>
        <tr className={styles.influencedTableHeader}>
          <th className="text-cell">Candidate</th>
          <th className="center-cell">State</th>
          <th className="center-cell">Office</th>
          <th className="number-cell">Support</th>
          <th className="number-cell">Oppose</th>
          <th className="small-cell center-cell">
            Goal{" "}
            <span className="no-wrap">
              achieved?
              <InformationalTooltip>
                <span>
                  The PACs&rsquo; goal is considered to have been achieved if a
                  candidate they supported won their election, or if a candidate
                  they opposed lost.
                </span>
              </InformationalTooltip>
            </span>
          </th>
          <th className="long-text-cell">Outcome</th>
        </tr>
      </thead>
      <tbody className={styles.inheritBorderRadius}>{contents}</tbody>
    </table>
  );
}
