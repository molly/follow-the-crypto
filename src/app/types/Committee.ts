import { CommitteeDetail, CommitteeTotals } from "./FECTypes";

export type CommitteeConstant = {
  id: string;
  name: string;
  description?: TrustedHTML;
};

export type CommitteeDetails = CommitteeConstant &
  Pick<
    CommitteeDetail,
    | "affiliated_committee_name"
    | "candidate_ids"
    | "committee_type"
    | "committee_type_full"
    | "cycles"
    | "designation"
    | "designation_full"
    | "first_f1_date"
    | "leadership_pac"
    | "name"
    | "organization_type"
    | "organization_type_full"
    | "party"
    | "party_full"
    | "party_type"
    | "party_type_full"
    | "sponsor_candidate_ids"
    | "website"
  > &
  Pick<
    CommitteeTotals,
    | "contributions"
    | "contribution_refunds"
    | "disbursements"
    | "net_contributions"
    | "receipts"
    | "independent_expenditures"
  >;

export type AllCommitteesSummary = {
  is_crypto: boolean;
  description?: string;
} & Pick<
  CommitteeTotals,
  | "committee_id"
  | "committee_name"
  | "committee_type"
  | "committee_type_full"
  | "committee_designation"
  | "committee_designation_full"
  | "receipts"
  | "disbursements"
  | "independent_expenditures"
  | "last_cash_on_hand_end_period"
>;
