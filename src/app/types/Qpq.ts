export type QPQContribution = {
  amount?: number;
  recipient?: string;
  benefit?: string;
  link?: string;
};

export type QPQBenefit = {
  text: string;
  link?: string;
};

export type QPQ = {
  name: string;
  link?: string;
  benefits: (string | QPQBenefit)[];
  contributions?: QPQContribution[];
};
