import {
  fetchConstant,
  fetchStateElections,
  fetchStateExpenditures,
} from "@/app/actions/fetch";
import Candidate, { CandidateImage } from "@/app/components/Candidate";
import { CommitteeLink } from "@/app/components/CommitteeLink";
import ErrorText from "@/app/components/ErrorText";
import Outcome from "@/app/components/Outcome";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { CommitteeConstant } from "@/app/types/Committee";
import {
  CandidateSummary,
  ElectionsByState,
  Race,
} from "@/app/types/Elections";
import { PopulatedStateExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { humanizeList } from "@/app/utils/humanize";
import { getFirstLastName } from "@/app/utils/names";
import { getRaceName, getSubraceName, sortRaces } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

const renderAmount = (amount: number, supportOppose: string) => {
  if (amount > 0) {
    return `${formatCurrency(amount, true)} to ${supportOppose}`;
  }
  return "";
};

function Influenced({
  candidate,
  committeeNames,
  races,
}: {
  candidate: CandidateSummary;
  committeeNames: JSX.Element[];
  races: Race[];
}) {
  const [_, lastName] = getFirstLastName(candidate.common_name);
  const committees = humanizeList(committeeNames);
  const amounts = humanizeList([
    renderAmount(candidate.support_total, "support"),
    renderAmount(candidate.oppose_total, "oppose"),
  ]);

  const involvedRaces = (candidate.expenditure_races as string[]).map(
    (raceType: string) => {
      const r = races.find((r) => r.type === raceType);
      if (!r) {
        return raceType;
      }
      return getSubraceName(r as Race);
    },
  );
  const raceStr = humanizeList(involvedRaces);
  return (
    <>
      <div>
        {committees}
        {` spent ${amounts} ${candidate.common_name} in the ${raceStr}.`}
      </div>
      {candidate.withdrew && (
        <div>{`${lastName} later withdrew from the race.`}</div>
      )}
      <div className={styles.candidateResultWithImage}>
        <Candidate
          candidateSummary={candidate}
          defeated={candidate.defeated}
          imageOnly={true}
        />
        {candidate.common_name}
        <Outcome
          candidate={candidate}
          races={races}
          inSentence={true}
          withIcon={false}
        />
        .
      </div>
    </>
  );
}

export function RaceCardContentsSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      {range(3).map((i) => (
        <div key={`race-skeleton-${i}`} className={styles.cardSection}>
          <Skeleton randWidth={[5, 15]} height="1.17em" onCard={true} />
          <Skeleton randWidth={[10, 25]} onCard={true} />
          <div className={styles.candidateResultWithImage}>
            <CandidateImage />
            <Skeleton randWidth={[10, 15]} onCard={true} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function RaceCard({ stateAbbr }: { stateAbbr: string }) {
  const [expendituresData, electionData, committeeData] = await Promise.all([
    fetchStateExpenditures(stateAbbr),
    fetchStateElections(stateAbbr),
    fetchConstant("committees"),
  ]);

  if (isError(electionData) || isError(expendituresData)) {
    if (is4xx(electionData) || is4xx(expendituresData)) {
      return (
        <span className="secondary">
          No spending has been recorded in this state.
        </span>
      );
    }
    return <ErrorText subject="state election information" />;
  }

  const COMMITTEES = (committeeData || {}) as Record<string, CommitteeConstant>;
  const expenditures = expendituresData as PopulatedStateExpenditures;
  const elections = electionData as ElectionsByState;
  const orderedRaces = Object.keys(expenditures.by_race).sort(sortRaces);

  return (
    <>
      {orderedRaces.map(async (raceId) => {
        const race = expenditures.by_race[raceId];
        const shortId = raceId.split("-").slice(1).join("-");
        const involvedCommittees = new Set(
          race.expenditures.map((exp) => exp.committee_id),
        );
        const influenced = Object.values(elections[shortId].candidates).filter(
          (c: CandidateSummary) => c.support_total > 0 || c.oppose_total > 0,
        );

        return (
          <div key={raceId} className={styles.cardSection}>
            <Link href={`/elections/${raceId}`}>
              <h3>{getRaceName(raceId)}</h3>
            </Link>
            {influenced.map((candidate) => {
              const committeeNames = (
                candidate.expenditure_committees as string[]
              ).map((cid) => (
                <CommitteeLink
                  key={cid}
                  committeeId={cid}
                  committeeName={COMMITTEES ? COMMITTEES[cid].name : cid}
                />
              ));

              return (
                <Influenced
                  key={candidate.candidate_id}
                  candidate={candidate}
                  committeeNames={committeeNames}
                  races={elections[shortId].races}
                />
              );
            })}
          </div>
        );
      })}
    </>
  );
}
