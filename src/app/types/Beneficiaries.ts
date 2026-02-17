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

export type CompanyContributionGroup = {
  company_id: string;
  company_name: string;
  total: number;
  contributions: BeneficiaryContribution[];
};

export type BeneficiaryCommittee = { designation_full?: string } & Pick<
  AllCommitteesSummary,
  "committee_type_full" | "description" | "committee_name" | "committee_id"
>;

export interface CommitteeBeneficiary {
  contributions: CompanyContributionGroup[];
  total: number;
  type: "committee";
  committee_details?: BeneficiaryCommittee;
}

export interface CandidateBeneficiary {
  contributions: CompanyContributionGroup[];
  total: number;
  type: "candidate";
  committee_details?: BeneficiaryCommittee;
  candidate_details: RecipientCandidateDetails & {
    isRunningThisCycle: boolean;
  };
}

export type Beneficiary = CommitteeBeneficiary | CandidateBeneficiary;
