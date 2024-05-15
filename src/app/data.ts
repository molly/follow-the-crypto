export type Committee = {
  id: string;
  name: string;
};

export const COMMITTEES: Record<string, Committee> = {
  "defend-american-jobs": {
    id: "C00836221",
    name: "Defend American Jobs",
  },
  fairshake: {
    id: "C00835959",
    name: "FairShake",
  },
  "protect-progress": {
    id: "C00848440",
    name: "Protect Progress",
  },
};

export const COMPANY_ALIASES: Record<string, string> = {
  "AH CAPITAL MANAGEMENT": "Andreessen Horowitz",
  "AH CAPITAL MANAGEMENT LLC": "Andreessen Horowitz",
  "BLOCKCHAIN CAPITAL, LLC": "Blockchain Capital",
  "BLOCKCHAIN CAPITAL. LLC": "Blockchain Capital",
  COINBASE: "Coinbase",
  "COINBASE COMMERCE (EXCHANGE)": "Coinbase",
  "COINBASE INC": "Coinbase",
  "MULTICOIN CAPITAL GROUP LLC": "Multicoin Capital",
  "MULTICOIN CAPITAL GP": "Multicoin Capital",
  "MULTICOIN CAPITAL": "Multicoin Capital",
  "PAYWARD, INC.": "Kraken",
  "PARADIGM OPERATIONS": "Paradigm",
  "PARADIGM OPERATIONS LP": "Paradigm",
};
