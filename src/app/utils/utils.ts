export function currency(value?: number, round = false): string {
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
