import { Expenditures } from "@/app/types/Expenditures";
import { currency } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import styles from "./chloroplethMap.module.css";

export default function ChloroplethTooltip({
  state,
  expenditures,
  centroid,
  svgSize,
}: {
  state?: string;
  expenditures?: Expenditures;
  centroid?: [number, number];
  svgSize?: DOMRect;
}) {
  const router = useRouter();
  const scale = svgSize ? svgSize.width / 960 : 1;

  if (state && expenditures && centroid) {
    const races = Object.keys(expenditures.by_race).sort((a, b) => {
      const raceA = a.split("-");
      const raceB = b.split("-");
      if (raceA[1] === "S") {
        return -1;
      } else {
        return raceA[2].localeCompare(raceB[2]);
      }
    });

    return (
      <div
        className={styles.tooltip}
        style={{
          left: centroid[0] * scale,
          top: centroid[1] * scale,
        }}
      >
        <h3>{state}</h3>
        <table>
          <tbody>
            <tr>
              <td className={styles.tooltipTableName}>
                <b>Total spending</b>
              </td>
              <td className={styles.tooltipTableSpending}>
                <b>{currency(expenditures?.total, true)}</b>
              </td>
            </tr>
            {races.map((k) => {
              const race = expenditures.by_race[k];
              if (race.details.candidate_office === "S") {
                return (
                  <tr
                    key={k}
                    className={styles.tooltipTableRaceRow}
                    onClick={() => router.push(`/race/${k}`)}
                  >
                    <td className={styles.tooltipTableName}>Senate</td>
                    <td className={styles.tooltipTableSpending}>
                      {currency(race.total, true)}
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr
                    key={k}
                    className={styles.tooltipTableRaceRow}
                    onClick={() => router.push(`/race/${k}`)}
                  >
                    <td className={styles.tooltipTableName}>
                      House District{" "}
                      {parseInt(race.details.candidate_office_district, 10)}
                    </td>
                    <td className={styles.tooltipTableSpending}>
                      {currency(race.total, true)}
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}
