import {
  fetchAllStateElections,
  fetchCandidateExpenditures,
} from "@/app/actions/fetch";
import styles from "@/app/components/tables.module.css";
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
import Outcome from "./Outcome";
import OverflowSection from "./OverflowSection";
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
  return range(fullPage ? 20 : 6).map((i) => (
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

function CandidateRow({
  candidate,
  race,
  small,
}: {
  candidate: ExpenditureCandidateSummary;
  race: ElectionGroup;
  small?: boolean;
}) {
  const raceHref = `/races/${candidate.state}-${candidate.race}`;
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
          <Link className="unstyled" href={`/states/${candidate.state}`}>
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
        <td className="text-cell">
          <Outcome candidate={candidate} races={race.races} withIcon={true} />
        </td>
      </tr>
    );
  } else {
    return (
      <div key={candidate.common_name} className={styles.influencedRow}>
        <Candidate candidateSummary={candidate} imageOnly={true} />
        <div>
          {`${renderPlaintextSpending(candidate)} ${candidate.common_name} for `}
          <Link
            href={raceHref}
          >{`${STATES_BY_ABBR[candidate.state]} ${raceName}`}</Link>
          .
          <div>
            <Outcome candidate={candidate} races={race.races} withIcon={true} />
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
    if (!small) {
      return (
        <tr className={styles.influencedErrorRow}>
          <td colSpan={6}>
            <ErrorText
              subject="the list of races influenced by
        crypto industry money"
            />
          </td>
        </tr>
      );
    }
  }

  const { order, candidates } = expenditures as ExpendituresByCandidate;

  const raceDetails = raceDetailsData as Record<string, ElectionsByState>;

  const contents = order.map((candidateName) => {
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
    return <OverflowSection fullPage={fullPage}>{contents}</OverflowSection>;
  }
  return (
    <OverflowSection fullPage={fullPage} headerHeight="2.2rem">
      <table className={styles.influencedTable}>
        <thead className={styles.inheritBorderRadius}>
          <tr className={styles.influencedTableHeader}>
            <th className={`${styles.inheritBorderRadius} text-cell`}>
              Candidate
            </th>
            <th className="center-cell">State</th>
            <th className="center-cell">Office</th>
            <th className="number-cell">Support</th>
            <th className="number-cell">Oppose</th>
            <th className={`${styles.inheritBorderRadius} long-text-cell`}>
              Outcome
            </th>
          </tr>
        </thead>
        <tbody className={styles.inheritBorderRadius}>{contents}</tbody>
      </table>
    </OverflowSection>
  );
}
