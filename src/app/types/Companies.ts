import { IndividualOrCompanyContributionGroup } from "./Contributions";
import { IndividualConstant } from "./Individuals";

export interface CompanyConstant {
  name: string;
  os_id: string;
  id: string;
  description: TrustedHTML;
  country?: string;
  aliases?: string[];
}

export interface CompanyOpenSecrets {
  cycle: string;
  dems: string;
  gave_to_527: string;
  gave_to_cand: string;
  gave_to_pac: string;
  gave_to_party: string;
  indivs: string;
  lobbying: string;
  mems_invested: string;
  orgid: string;
  orgname: string;
  outside: string;
  pacs: string;
  repubs: string;
  soft: string;
  source: string;
  tot527: string;
  total: string;
}

export type Company = CompanyConstant & {
  openSecrets: CompanyOpenSecrets;
  relatedIndividuals: IndividualConstant[];
  contributions: IndividualOrCompanyContributionGroup[];
  party_summary: Record<string, number>;
};
