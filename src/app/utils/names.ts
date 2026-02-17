import { titlecaseIndividualName } from "./titlecase";

export const getFirstLastName = (commonName: string): string[] => {
  const isUppercase = commonName === commonName.toLocaleUpperCase();
  if (isUppercase) {
    commonName = titlecaseIndividualName(commonName);
  }

  let nameParts = commonName.split(" ");
  const firstName = nameParts[0];
  let lastName = nameParts[nameParts.length - 1];
  if (lastName.match(/^([IVX]|[SJ]r\.?)+$/)) {
    lastName = nameParts[nameParts.length - 2];
  }
  return [firstName, lastName];
};

export const formatCompanyName = (company: string): string => {
  let companyName = company.replace(/ Com$/, ".com");
  companyName = companyName.replace(/\b(BTC|MARA)\b/gi, function (txt) {
    return txt.toUpperCase();
  });
  return companyName;
};
