export type QPQContribution = {
  amount?: number;
  recipient?: string;
  benefit?: string;
};

export type QPQ = {
  name: string;
  link?: string;
  benefits: string[];
  contributions?: QPQContribution[];
};
