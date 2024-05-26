import { Expenditures } from "@/app/types/Expenditures";
import { sortRaces } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
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
  const scale = svgSize ? svgSize.width / 1000 : 1;

  const races = useMemo(() => {
    if (expenditures) {
      return Object.keys(expenditures.by_race).sort(sortRaces);
    } else {
      return [];
    }
  }, [expenditures]);

  if (state && expenditures && centroid) {
    return (
      <div
        className={styles.tooltip}
        style={{
          left: centroid[0] * scale,
          top: centroid[1] * scale,
        }}
      >
        <h3>
          <Link
            href={`/states/${state.toLocaleLowerCase().split(" ").join("-")}`}
          >
            {state}
          </Link>
        </h3>
        <table>
          <tbody>
            <tr>
              <td className={styles.tooltipTableName}>
                <b>Total spending</b>
              </td>
              <td className={styles.tooltipTableSpending}>
                <b>{formatCurrency(expenditures?.total, true)}</b>
              </td>
            </tr>
            {races.map((k) => {
              const race = expenditures.by_race[k];
              if (race.details.candidate_office === "S") {
                return (
                  <tr
                    key={k}
                    className={styles.tooltipTableRaceRow}
                    onClick={() => router.push(`/races/${k}`)}
                  >
                    <td className={styles.tooltipTableName}>Senate</td>
                    <td className={styles.tooltipTableSpending}>
                      {formatCurrency(race.total, true)}
                    </td>
                  </tr>
                );
              } else {
                return (
                  <tr
                    key={k}
                    className={styles.tooltipTableRaceRow}
                    onClick={() => router.push(`/races/${k}`)}
                  >
                    <td className={styles.tooltipTableName}>
                      House District{" "}
                      {parseInt(race.details.candidate_office_district, 10)}
                    </td>
                    <td className={styles.tooltipTableSpending}>
                      {formatCurrency(race.total, true)}
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
