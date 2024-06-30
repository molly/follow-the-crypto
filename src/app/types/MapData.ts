export interface StateTotals {
  total: number;
  by_race: Record<string, number>;
}

export interface MapData {
  [state: string]: StateTotals;
}
