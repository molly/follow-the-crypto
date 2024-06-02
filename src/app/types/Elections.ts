import { Candidate } from "./FECTypes";

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
}

export enum RaceType {
  General = "general",
  Primary = "primary",
  PrimaryRunoff = "primary_runoff",
  Convention = "convention",
  Special = "special",
}

export type CandidateSummary = {
  FEC_name: string;
  common_name: string;
  defeated?: boolean;
  withdrew?: boolean;
  defeated_race: RaceType;
  oppose_total: number;
  support_total: number;
  races: RaceType[];
  expenditure_races?: RaceType[];
  expenditure_committees?: string[];
} & Pick<Candidate, "candidate_id" | "incumbent_challenge" | "party">;

export interface Race {
  candidates: RaceCandidate[];
  type: RaceType;
  party?: Party;
  date: string;
}

export interface ElectionGroup {
  races: Race[];
  candidates: Record<string, CandidateSummary>;
  candidatesOrder: string[];
}

export interface ElectionsByState {
  [raceId: string]: ElectionGroup;
}
