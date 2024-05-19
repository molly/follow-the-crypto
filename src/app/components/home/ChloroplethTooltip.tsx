import { Expenditures } from "@/app/types/Expenditures";
import { currency } from "@/app/utils/utils";
import styles from "./chloroplethMap.module.css";

export default function ChloroplethTooltip({
  state,
  expenditures,
  centroid,
}: {
  state: string;
  expenditures: Expenditures;
  centroid: [number, number];
}) {
  console.log(expenditures);
  if (expenditures) {
    return (
      <div
        className={styles.tooltip}
        style={{
          left: centroid[0],
          top: centroid[1],
        }}
      >
        <h3>{state}</h3>
        <span>Total spending: {currency(expenditures?.total, true)}</span>
      </div>
    );
  }
  return null;
}
