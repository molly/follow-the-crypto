import { formatCurrency } from "./utils";

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

export const humanizeApproximateRounded = (value: number): string => {
  if (value < 1000) {
    return value.toString();
  }
  if (value < 1000000) {
    return `${Math.floor(value / 1000)}K`;
  }
  return `${Math.floor(value / 1000000)}M`;
};

// This always rounds DOWN.
export const humanizeRoundedCurrency = (
  value: number,
  round = false,
): string => {
  if (value >= 1000000) {
    let amount;
    if (round) {
      amount = Math.floor(value / 1000000);
    } else {
      amount = value / 1000000;
    }
    return `$${amount} million`;
  } else if (value < 10000) {
    let amount = round ? Math.floor(value / 1000) : value / 1000;
    return `${amount} thousand`;
  }
  return formatCurrency(value, true);
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

export function humanizeList<T>(values: T[]): T | JSX.Element | string | null {
  const isString = values.every((value) => typeof value === "string");
  const filtered = values.filter((value) => !!value);
  if (filtered.length === 0) {
    return null;
  }
  if (filtered.length === 1) {
    return filtered[0];
  } else if (filtered.length === 2) {
    if (isString) {
      return `${filtered[0]} and ${filtered[1]}`;
    }
    return (
      <>
        {filtered[0]} and {filtered[1]}
      </>
    );
  }
  const last = filtered.pop();
  const elements = [];
  for (const value of filtered) {
    elements.push(value);
    elements.push(", ");
  }
  elements.push("and ");
  elements.push(last);
  if (isString) {
    return elements.join("");
  }
  return <>{elements}</>;
}
