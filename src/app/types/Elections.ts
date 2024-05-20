import { Election, ElectionDates } from "./FECTypes";

export interface ElectionGroup {
  candidates: Election[];
  dates: ElectionDates[];
}
