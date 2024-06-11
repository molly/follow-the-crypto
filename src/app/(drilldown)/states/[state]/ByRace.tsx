import { fetchConstant, fetchStateElections } from "@/app/actions/fetch";
import { CommitteeLink } from "@/app/components/CommitteeLink";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditures } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { humanizeList } from "@/app/utils/humanize";
import { getRaceName, getSubraceName, sortRaces } from "@/app/utils/races";
import { getRandomInt, range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import { Suspense } from "react";
import styles from "./page.module.css";

import Candidate from "@/app/components/Candidate";
import Outcome from "@/app/components/Outcome";
import {
  CandidateSummary,
  ElectionsByState,
  Race,
} from "@/app/types/Elections";
import { getFirstLastName } from "@/app/utils/names";

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
        <Candidate candidateSummary={candidate} defeated={candidate.defeated} />
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

async function RaceCardContents({
  expenditures,
  stateAbbr,
}: {
  expenditures: Expenditures;
  stateAbbr: string;
}) {
  const [electionData, committeeData] = await Promise.all([
    fetchStateElections(stateAbbr),
    fetchConstant("committees"),
  ]);

  if (isError(electionData)) {
    return <div>Something went wrong when fetching election data.</div>;
  }

  const COMMITTEES = isError(committeeData)
    ? null
    : (committeeData as Record<string, CommitteeConstant>);
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
            <Link href={`/races/${raceId}`}>
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

function RaceCardContentsSkeleton() {
  return (
    <>
      {range(getRandomInt(2, 4)).map((i) => (
        <div key={`race-skeleton-${i}`} className={styles.cardSection}>
          <Skeleton randWidth={[5, 10]} height="1.17em" />
          {range(getRandomInt(2, 6)).map((j) => (
            <Skeleton key={`race-skeleton-${i}-${j}`} randWidth={[5, 8]} />
          ))}
        </div>
      ))}
    </>
  );
}

export default async function ByRace({
  expenditures,
  stateAbbr,
}: {
  expenditures: Expenditures;
  stateAbbr: string;
}) {
  return (
    <div className={styles.raceCard}>
      <h2>By race</h2>
      <Suspense fallback={<RaceCardContentsSkeleton />}>
        <RaceCardContents expenditures={expenditures} stateAbbr={stateAbbr} />
      </Suspense>
    </div>
  );
}
