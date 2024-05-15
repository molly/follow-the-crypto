import { COMPANY_ALIASES } from "../data/companyAliases";
import { ErrorType } from "../types/Error";
import { ScheduleA, ScheduleAPage } from "../types/FECTypes";
import {
  titlecase,
  titlecaseCompany,
  titlecaseOccupation,
  titlecaseSuffix,
} from "./titlecase";

export type DonorType = IndividualDonorType | CompanyDonorType;

type IndividualDonorType = {
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

function getIndividualDonorName(donor: ScheduleA): IndividualDonorType {
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

export function getCompanyDetails(company: string) {}

function getDonorCompanyDetails(donor: ScheduleA): {
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
  donor: ScheduleA,
): IndividualDonorType | CompanyDonorType {
  if (donor.contributor_first_name || donor.contributor_last_name) {
    return {
      ...getIndividualDonorName(donor),
      ...getDonorCompanyDetails(donor),
      isIndividual: true,
    };
  } else if (donor.contributor_name) {
    return {
      ...getDonorCompanyDetails(donor),
      isIndividual: false,
    };
  }
  return { company: "", isIndividual: false };
}

export interface DonorGroup {
  company?: string;
  contributions: ScheduleA[];
  total: number;
}

export function mergeDonors(donors: ScheduleAPage | ErrorType): DonorGroup[] {
  const donorMap: Record<string, DonorGroup> = {};
  if ("results" in donors && donors.results) {
    for (const donor of donors.results) {
      let group = donor.contributor_employer || donor.contributor_name;
      if (
        group &&
        ["RETIRED", "SELF", "INDEPENDENT CONTRACTOR"].includes(group)
      ) {
        group = donor.contributor_name;
      }
      if (!group) {
        group = "UNKNOWN";
      }
      if (group in COMPANY_ALIASES) {
        group = COMPANY_ALIASES[group];
      }

      if (group in donorMap) {
        donorMap[group].contributions.push(donor);
        donorMap[group].total += donor.contribution_receipt_amount || 0;
      } else {
        donorMap[group] = {
          contributions: [donor],
          total: donor.contribution_receipt_amount || 0,
        };
      }
    }

    return Object.entries(donorMap)
      .map(([company, data]) => ({ company, ...data }))
      .sort((a, b) => b.total - a.total);
  }
  return [];
}
