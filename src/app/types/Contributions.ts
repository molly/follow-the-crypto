import { Committee, ScheduleA } from "./FECTypes";

export interface ManualReview {
  reviewed: boolean;
  status: "verified" | "omit";
  reviewed_at: string;
}

export type SingleContribution = {
  redacted?: boolean;
  link?: string;
  claimed?: boolean;
  description?: string;
  manualReview?: ManualReview;
} & Pick<
  ScheduleA,
  | "contributor_aggregate_ytd"
  | "contributor_first_name"
  | "contributor_middle_name"
  | "contributor_last_name"
  | "contributor_suffix"
  | "contributor_name"
  | "contributor_occupation"
  | "contributor_employer"
  | "contribution_receipt_amount"
  | "contribution_receipt_date"
  | "entity_type"
  | "pdf_url"
  | "receipt_type"
  | "receipt_type_full"
  | "transaction_id"
>;

export type RollupContribution = {
  redacted?: boolean;
  link?: string;
  claimed?: boolean;
  description?: string;
  manualReview?: ManualReview;
  oldest: string;
  newest: string;
  total: number;
  total_receipt_amount: number;
} & Pick<
  ScheduleA,
  | "contributor_aggregate_ytd"
  | "contributor_first_name"
  | "contributor_middle_name"
  | "contributor_last_name"
  | "contributor_suffix"
  | "contributor_name"
  | "contributor_occupation"
  | "contributor_employer"
  | "entity_type"
>;

export type Contribution = SingleContribution | RollupContribution;

export interface ContributionsGroup {
  company?: string;
  contributions: Contribution[];
  total: number;
  link?: string;
}

export interface Contributions {
  contributions_count: number;
  by_date: SingleContribution[];
  groups: ContributionsGroup[];
  total_contributed: number;
  total_transferred: number;
}

export type IndividualOrCompanyContribution = {
  committee_name?: string;
  efiled?: boolean;
  link?: string;
  isIndividual?: boolean;
  individual?: string;
  claimed?: boolean;
  source?: string;
} & Pick<
  Committee,
  | "candidate_ids"
  | "committee_type"
  | "committee_type_full"
  | "designation"
  | "designation_full"
  | "party"
  | "state"
> &
  Pick<
    ScheduleA,
    | "committee_id"
    | "contribution_receipt_amount"
    | "contribution_receipt_date"
    | "pdf_url"
    | "receipt_type"
    | "receipt_type_full"
    | "transaction_id"
    | "entity_type"
    | "contributor_aggregate_ytd"
    | "memo_text"
    | "receipt_type"
    | "contributor_name"
  >;

export type IndividualOrCompanyContributionGroup = {
  contributions: IndividualOrCompanyContribution[];
  committee_id: string;
  total: number;
};

export type RecipientCandidateDetails = {
  district?: string;
  name: string;
  office: string;
  party: string;
  state: string;
  race_link?: string;
  election_years?: number[];
};

export type RecipientDetails = {
  committee_id: string;
  committee_name?: string;
  candidate_ids?: string[];
  sponsor_candidate_ids?: string[];
  committee_type_full?: string;
  designation_full?: string;
  party?: string;
  state?: string;
  candidate_details: Record<string, RecipientCandidateDetails>;
  link?: string;
  description?: string;
};
