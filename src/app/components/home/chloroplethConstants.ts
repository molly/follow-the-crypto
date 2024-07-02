export const DOMAIN = [
  10 ** 5,
  5 * 10 ** 5,
  10 ** 6,
  5 * 10 ** 6,
  10 ** 7,
  5 * 10 ** 7,
  10 ** 8,
];
export const FILL_CLASS_NAMES = Array.from(
  { length: DOMAIN.length },
  (_, i) => `stateFill${i + 1}`,
);
