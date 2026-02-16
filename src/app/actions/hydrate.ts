import {
  Expenditure,
  ExpenditureId,
  PopulatedStateExpenditures,
  StateExpenditures,
} from "../types/Expenditures";

export function hydrateStateExpenditures(
  stateExpenditures: StateExpenditures,
  allExpenditures: Record<ExpenditureId, Expenditure>,
): PopulatedStateExpenditures {
  const populatedStateExpenditures: PopulatedStateExpenditures = {
    by_committee: {},
    by_race: {},
    by_companies: stateExpenditures.by_companies,
    companies_total: stateExpenditures.companies_total,
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
