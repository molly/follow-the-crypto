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
    | "net_contributions"
    | "receipts"
    | "independent_expenditures"
  >;
