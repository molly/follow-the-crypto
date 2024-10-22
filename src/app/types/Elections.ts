import { Candidate, ScheduleEByCandidate } from "./FECTypes";

export enum Party {
  Democratic = "D",
  Republican = "R",
  Libertarian = "L",
  Green = "G",
  Independent = "I",
  Nonpartisan = "N",
}

export interface RaceCandidate {
  name: string;
  party?: Party;
  percentage?: number;
  won?: boolean;
  withdrew?: boolean;
  writeIn?: boolean;
}

export enum RaceType {
  General = "general",
  Primary = "primary",
  PrimaryRunoff = "primary_runoff",
  Convention = "convention",
  Special = "special",
}

type OutsideSpending = {
  support_total: number;
  oppose_total: number;
  support: ScheduleEByCandidate[];
  oppose: ScheduleEByCandidate[];
};

export type CandidateSummary = {
  common_name: string;
  oppose_total: number;
  support_total: number;
  races: RaceType[];
  defeated?: boolean;
  defeated_race?: RaceType;
  withdrew?: boolean;
  withdrew_race?: RaceType;

  FEC_name: string;
  candidate_id?: string;
  incumbent_challenge?: string;
  party?: Party;

  expenditure_races?: RaceType[];
  expenditure_committees?: string[];

  raised_total?: number;
  spent_total?: number;

  outside_spending?: OutsideSpending;
  opposition_details?: OppositionConstant;
  has_non_pac_support?: boolean;
} & Pick<Candidate, "candidate_id" | "incumbent_challenge" | "party">;

export interface Race {
  candidates: RaceCandidate[];
  type: RaceType;
  party?: Party;
  date: string;
  canceled?: boolean;
}

type SubraceSpending = {
  candidates: {
    [candidate: string]: {
      support: number;
      oppose: number;
    };
  };
  total: number;
};

export type RaceSpending = {
  subraces: {
    [subrace: string]: {
      candidates: {
        [candidate: string]: {
          support: number;
          oppose: number;
        };
      };
      total: number;
    };
  };
  total: number;
};

export interface ElectionGroup {
  races: Race[];
  candidates: Record<string, CandidateSummary>;
  spending: Record<string, RaceSpending>;
}

export interface ElectionsByState {
  [raceId: string]: ElectionGroup;
}

export interface OppositionConstant {
  benefitsCandidate?: string;
  benefitsParty?: string;
  supportedBeneficiary?: boolean;
}
