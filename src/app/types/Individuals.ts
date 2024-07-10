import {
  HydratedIndividualOrCompanyContributionGroup,
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
  associatedCompany?: string;
  party_summary: Record<string, number>;
  contributions: Record<string, IndividualOrCompanyContributionGroup>;
};

export type HydratedIndividualContributions = {
  associatedCompany?: string;
  party_summary: Record<string, number>;
  contributions: HydratedIndividualOrCompanyContributionGroup[];
};
