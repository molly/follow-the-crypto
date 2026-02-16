export function generateDomain(min: number, max: number): number[] {
  const steps = [1, 5];
  const result: number[] = [];

  let power = Math.floor(Math.log10(min));
  let done = false;

  while (!done) {
    for (const step of steps) {
      const value = step * 10 ** power;
      if (value < min) {
        continue;
      }
      if (value > max) {
        done = true;
        break;
      }
      result.push(value);
    }
    power++;
  }

  return result;
}

export const getFillClassNames = (domain: number[]) =>
  Array.from({ length: domain.length }, (_, i) => `stateFill${i + 1}`);
