import { Company, HydratedCompany } from "../types/Companies";
import {
  HydratedIndividualOrCompanyContributionGroup,
  RecipientDetails,
} from "../types/Contributions";
import {
  Expenditure,
  ExpenditureId,
  PopulatedStateExpenditures,
  StateExpenditures,
} from "../types/Expenditures";
import {
  HydratedIndividualContributions,
  IndividualContributions,
} from "../types/Individuals";

export function hydrateStateExpenditures(
  stateExpenditures: StateExpenditures,
  allExpenditures: Record<ExpenditureId, Expenditure>,
): PopulatedStateExpenditures {
  const populatedStateExpenditures: PopulatedStateExpenditures = {
    by_committee: {},
    by_race: {},
    total: stateExpenditures.total,
  };

  // Populate expenditures by committee
  const committeeIds = Object.keys(stateExpenditures.by_committee);
  for (const committeeId of committeeIds) {
    populatedStateExpenditures.by_committee[committeeId] = {
      expenditures: [],
      total: stateExpenditures.by_committee[committeeId]["total"],
    };
    populatedStateExpenditures.by_committee[committeeId]["expenditures"] =
      stateExpenditures.by_committee[committeeId]["expenditures"].map(
        (expenditureId) => allExpenditures[expenditureId],
      );
  }

  // Populate expenditures by race
  const raceIds = Object.keys(stateExpenditures.by_race);
  for (const raceId of raceIds) {
    populatedStateExpenditures.by_race[raceId] = {
      expenditures: [],
      details: stateExpenditures.by_race[raceId]["details"],
      total: stateExpenditures.by_race[raceId]["total"],
    };
    populatedStateExpenditures.by_race[raceId]["expenditures"] =
      stateExpenditures.by_race[raceId]["expenditures"].map(
        (expenditureId) => allExpenditures[expenditureId],
      );
  }
  return populatedStateExpenditures;
}

export function hydrateIndividualContributions(
  data: IndividualContributions | Company,
  recipientsData: Record<string, RecipientDetails>,
): HydratedIndividualContributions | HydratedCompany {
  let resultsObj: Record<string, HydratedIndividualOrCompanyContributionGroup> =
    {};
  for (const committeeId of Object.keys(data.contributions)) {
    resultsObj[committeeId] = Object.assign(
      {},
      data.contributions[
        committeeId
      ] as HydratedIndividualOrCompanyContributionGroup,
      recipientsData[committeeId] as RecipientDetails,
    );
  }

  const sortedContributions = Object.values(resultsObj).sort((a, b) => {
    const totalDifference = (b.total || 0) - (a.total || 0);
    if (totalDifference !== 0) return totalDifference;
    return (a.committee_name || "zzz").localeCompare(b.committee_name || "zzz");
  });
  return {
    ...data,
    contributions: sortedContributions,
  };
}
