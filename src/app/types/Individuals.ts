import {
  IndividualOrCompanyContribution,
  IndividualOrCompanyContributionGroup,
} from "./Contributions";

export interface IndividualConstant {
  name: string;
  id: string;
  company?: string;
  title?: string;
  photoCredit?: string;
}

export type IndividualContributions = {
  associatedCompany: string[];
  party_summary: Record<string, number>;
  contributions: IndividualOrCompanyContributionGroup[];
  contributions_by_date?: IndividualOrCompanyContribution[];
};
