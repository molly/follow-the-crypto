import * as d3 from "d3";

export const getLabelColor = (barColor: string): string => {
  const hsl = d3.hsl(barColor);
  return hsl.l > 0.6 ? "#020617" : "#e2e8f0";
};
