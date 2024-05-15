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
