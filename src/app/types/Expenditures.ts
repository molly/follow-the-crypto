import { CandidateSummary } from "./Elections";
import { ScheduleE } from "./FECTypes";

enum CandidateOffice {
  President = "P",
  Senate = "S",
  House = "H",
}

export type Expenditure = {
  committee_id: number;
  subrace: string;
  uid: string;
} & Pick<
  ScheduleE,
  | "expenditure_amount"
  | "candidate_office_state"
  | "expenditure_date"
  | "expenditure_description"
  | "candidate_id"
  | "candidate_first_name"
  | "candidate_last_name"
  | "candidate_middle_name"
  | "candidate_suffix"
  | "candidate_name"
  | "candidate_office"
  | "candidate_office_state"
  | "candidate_office_district"
  | "candidate_party"
  | "category_code"
  | "category_code_full"
  | "dissemination_date"
  | "election_type"
  | "payee_name"
  | "support_oppose_indicator"
  | "transaction_id"
>;

export type ExpenditureId = string;

export type CommitteeTotalExpenditures = {
  expenditures: number | null;
  disbursements: number | null;
};

interface ExpenditureGroup {
  expenditures: ExpenditureId[];
  total: number;
}

interface PopulatedExpenditureGroup {
  expenditures: Expenditure[];
  total: number;
}

interface RaceDetails {
  candidate_office: CandidateOffice;
  candidate_office_district: string;
}

export interface RaceExpenditureGroup extends ExpenditureGroup {
  details: RaceDetails;
}

export interface PopulatedRaceExpenditureGroup
  extends PopulatedExpenditureGroup {
  details: RaceDetails;
}

export interface StateExpenditures {
  by_committee: Record<string, ExpenditureGroup>;
  by_race: Record<string, RaceExpenditureGroup>;
  total: number;
}

export interface PopulatedStateExpenditures {
  by_committee: Record<string, PopulatedExpenditureGroup>;
  by_race: Record<string, PopulatedRaceExpenditureGroup>;
  total: number;
}

export interface RecentExpenditures {
  all: ExpenditureId[];
  by_committee: Record<string, ExpenditureId[]>;
}

export interface ExpendituresByParty {
  dem_oppose: number;
  dem_support: number;
  rep_oppose: number;
  rep_support: number;
  oppose_benefit_dem: number;
  oppose_benefit_rep: number;
  oppose_benefit_mix: number;
  oppose_benefit_unk: number;
}

export interface ExpenditureTotals {
  all: number;
  by_committee: Record<string, number>;
}

export interface Expenditures {
  all: Expenditure[];
  recent: RecentExpenditures;
  states: StateExpenditures;
  by_party: ExpendituresByParty;
  total: ExpenditureTotals;
}

export type ExpenditureCandidateSummary = {
  state: string;
  race: string;
} & CandidateSummary;

export interface ExpendituresByCandidate {
  order: string[];
  candidates: Record<string, ExpenditureCandidateSummary>;
}
