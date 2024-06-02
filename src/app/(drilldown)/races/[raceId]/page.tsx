import {
  fetchStateElections,
  fetchStateExpenditures,
} from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { ElectionsByState } from "@/app/types/Elections";
import { Expenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import type { Metadata } from "next";
import RaceSummary from "./RaceSummary";

export async function generateMetadata({
  params,
}: {
  params: { raceId: string };
}): Promise<Metadata> {
  return {
    title: `TBD | Follow the Crypto`,
  };
}

export default async function RacePage({
  params,
}: {
  params: { raceId: string };
}) {
  const raceIdSplit = params.raceId.split("-");
  const shortRaceId = raceIdSplit.slice(1).join("-");
  const stateAbbr = raceIdSplit[0];

  let expendituresData = await fetchStateExpenditures(stateAbbr);
  const electionsData = await fetchStateElections(stateAbbr);

  if (isError(expendituresData) || isError(electionsData)) {
    if (is4xx(expendituresData) && is4xx(electionsData)) {
      return (
        <div className={sharedStyles.smallCard}>
          No spending has been recorded in this state.
        </div>
      );
    }
    return <div>Something went wrong when getting expenditure data.</div>;
  }

  const expenditures = expendituresData as Expenditures;
  const elections = electionsData as ElectionsByState;

  return (
    <RaceSummary
      raceId={params.raceId}
      race={expenditures.by_race[shortRaceId]}
      electionData={elections[shortRaceId]}
    />
  );
}