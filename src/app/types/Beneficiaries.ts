import { AllCommitteesSummary } from "./Committee";
import {
  IndividualOrCompanyContribution,
  RecipientCandidateDetails,
} from "./Contributions";

export type BeneficiaryContribution = {
  total: number;
  oldest: string;
  newest: string;
  committees: string[];
} & Pick<
  IndividualOrCompanyContribution,
  "individual" | "contributor_name" | "isIndividual"
>;

export type BeneficiaryCommittee = { designation_full?: string } & Pick<
  AllCommitteesSummary,
  "committee_type_full" | "description" | "committee_name" | "committee_id"
>;

export interface CommitteeBeneficiary {
  contributions: BeneficiaryContribution[];
  total: number;
  type: "committee";
  committee_details?: BeneficiaryCommittee;
}

export interface CandidateBeneficiary {
  contributions: BeneficiaryContribution[];
  total: number;
  type: "candidate";
  committee_details?: BeneficiaryCommittee;
  candidate_details: RecipientCandidateDetails & {
    isRunningThisCycle: boolean;
  };
}

export type Beneficiary = CommitteeBeneficiary | CandidateBeneficiary;
