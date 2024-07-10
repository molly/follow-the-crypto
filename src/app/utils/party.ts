export const getFullPartyName = (
  party: string,
  adjective: boolean = true,
): string => {
  switch (party) {
    case "D":
      return adjective ? "Democratic" : "Democrat";
    case "R":
      return "Republican";
    case "L":
      return "Libertarian";
    case "G":
      return "Green";
    case "I":
      return "Independent";
    case "N":
      return adjective ? "non-partisan" : "No party affiliation";
    case "U":
      return adjective ? "unknown" : "Unknown";
    default:
      return party;
  }
};
