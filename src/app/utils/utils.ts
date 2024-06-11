import { DateTime } from "luxon";

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

export const formatDate = (date?: Date): string => {
  if (!date) {
    return "";
  }
  return DateTime.fromJSDate(date, { zone: "utc" }).toLocaleString(
    DateTime.DATE_FULL,
  );
};

export const formatDateFromLuxon = (date: DateTime): string => {
  if (!date) {
    return "";
  }
  return date.toLocaleString(DateTime.DATE_FULL);
};

export const formatDateFromString = (date?: string): string => {
  if (!date) {
    return "";
  }
  return DateTime.fromISO(date, { zone: "utc" }).toLocaleString(
    DateTime.DATE_FULL,
  );
};

export const isUpcomingDate = (
  date: string,
  { inclusive }: { inclusive?: boolean } = {},
) => {
  const now = DateTime.utc().startOf("day");
  if (inclusive) {
    return DateTime.fromISO(date, { zone: "utc" }) >= now;
  }
  return DateTime.fromISO(date, { zone: "utc" }) > now;
};
