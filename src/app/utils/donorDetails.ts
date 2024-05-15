import { Contribution } from "../types/Contributions";
import {
  titlecase,
  titlecaseCompany,
  titlecaseOccupation,
  titlecaseSuffix,
} from "./titlecase";

export type DonorType = IndividualDonorType | CompanyDonorType;

export type IndividualDonorType = {
  name: string;
  company?: string;
  companyAlias?: string;
  occupation?: string;
  isIndividual: true;
};

type CompanyDonorType = {
  company?: string;
  companyAlias?: string;
  isIndividual: false;
};

function getIndividualDonorName(donor: Contribution): IndividualDonorType {
  let occupation;
  let name = [
    donor.contributor_first_name,
    donor.contributor_middle_name,
    donor.contributor_last_name,
  ]
    .filter((x) => !!x)
    .map((x) => titlecase(x as string))
    .join(" ");
  if (donor.contributor_suffix) {
    name += `, ${titlecaseSuffix(donor.contributor_suffix)}`;
  }
  if (donor.contributor_occupation) {
    occupation = titlecaseOccupation(donor.contributor_occupation);
  }
  return { name, occupation, isIndividual: true };
}

function getDonorCompanyDetails(
  donor: Contribution,
  COMPANY_ALIASES: Record<string, string>,
): {
  company: string | undefined;
  companyAlias: string | undefined;
} {
  let result: {
    company: string | undefined;
    companyAlias: string | undefined;
  } = { company: undefined, companyAlias: undefined };
  const company = donor.contributor_employer || donor.contributor_name;
  if (
    company &&
    !["RETIRED", "SELF", "INDEPENDENT CONTRACTOR"].includes(company)
  ) {
    result.company = titlecaseCompany(company);
    if (company in COMPANY_ALIASES) {
      result.companyAlias = COMPANY_ALIASES[company];
    }
  }
  return result;
}

export function getDonorDetails(
  donor: Contribution,
  COMPANY_ALIASES: Record<string, string>,
): IndividualDonorType | CompanyDonorType {
  if (donor.contributor_first_name || donor.contributor_last_name) {
    return {
      ...getIndividualDonorName(donor),
      ...getDonorCompanyDetails(donor, COMPANY_ALIASES),
      isIndividual: true,
    };
  } else if (donor.contributor_name) {
    return {
      ...getDonorCompanyDetails(donor, COMPANY_ALIASES),
      isIndividual: false,
    };
  }
  return { company: "", isIndividual: false };
}
