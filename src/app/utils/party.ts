export const getFullPartyName = (party: string): string => {
  switch (party) {
    case "D":
      return "Democratic";
    case "R":
      return "Republican";
    case "L":
      return "Libertarian";
    case "G":
      return "Green";
    case "I":
      return "Independent";
    case "N":
      return "non-partisan";
    default:
      return party;
  }
};
