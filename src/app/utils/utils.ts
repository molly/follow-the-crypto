export function formatCurrency(value?: number, round = false): string {
  if (!value) {
    return "";
  }
  if (round) {
    value = Math.round(value);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...(round && { maximumFractionDigits: 0, minimumFractionDigits: 0 }),
  }).format(value);
}

export const formatDate = (date: string): string => {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];
export const humanizeNumber = (value: number): string => {
  if (value < NUMBERS.length) {
    return NUMBERS[value];
  }
  return value.toString();
};

export const pluralize = (
  value: number,
  singular: string,
  options: { plural?: string; includeValue?: boolean; humanize?: boolean } = {},
) => {
  const plural = options.plural ? options.plural : `${singular}s`;
  if (options.includeValue) {
    const number = options.humanize ? humanizeNumber(value) : value;
    return value === 1 ? `${number} ${singular}` : `${number} ${plural}`;
  }
  return value === 1 ? singular : plural;
};
