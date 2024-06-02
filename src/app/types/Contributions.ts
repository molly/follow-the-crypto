import { ScheduleA } from "./FECTypes";

export type SingleContribution = { redacted?: boolean } & Pick<
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
}

export interface Contributions {
  contributions_count: number;
  groups: ContributionsGroup[];
  total_contributed: number;
  total_transferred: number;
}
