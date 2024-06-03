import { Race } from "@/app/types/Elections";
import { getFullPartyName } from "@/app/utils/party";
import { Expenditure } from "../types/Expenditures";

// Senate race first, then house races ordered by district
export const sortRaces = (a: string, b: string) => {
  const raceA = a.split("-");
  const raceB = b.split("-");
  if (raceA[1] === "S") {
    return -1;
  } else if (raceB[1] === "S") {
    return 1;
  } else {
    return raceA[2].localeCompare(raceB[2]);
  }
};

export const getRaceName = (raceId: string) => {
  const raceParts = raceId.split("-");
  if (raceParts[1] === "S") {
    return "Senate";
  } else if (raceParts[1] === "H") {
    return `House District ${parseInt(raceParts[2], 10)}`;
  }
};

export const getSubraceName = (race?: Race) => {
  if (!race) {
    return "";
  }
  if (race.type === "general") {
    return "general election";
  } else {
    const party = race.party ? getFullPartyName(race.party) : null;
    const raceName = race.type.replace("_", " ");
    if (party) {
      return `${party} ${raceName}`;
    }
    return raceName;
  }
};

export const getExpenditureRaceType = (
  expenditure: Expenditure,
): string | null => {
  const electionType = expenditure.election_type
    ? expenditure.election_type[0]
    : null;
  if (!electionType) {
    return null;
  }
  switch (electionType) {
    case "G":
      return "general";
    case "P":
      return "primary";
    case "R":
      return "primary_runoff";
    case "C":
      return "convention";
    case "S":
      return "special";
  }
  return null;
};
