import { fetchMapData } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { STATES_BY_ABBR } from "@/app/data/states";
import { MapData } from "@/app/types/MapData";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import { Fragment } from "react";
import styles from "./page.module.css";

export function StateExpendituresSkeleton() {
  return (
    <tbody>
      {range(5).map((i) => (
        <Fragment key={`state-skeleton-${i}`}>
          <tr>
            <td colSpan={2}>
              <Skeleton width="8rem" onCard={true} />
            </td>
            <td>
              <Skeleton width="6rem" onCard={true} style={{ float: "right" }} />
            </td>
          </tr>
          {range(3).map((j) => (
            <tr key={`race-skeleton-${i}-${j}`}>
              <td></td>
              <td>
                <Skeleton width="10rem" onCard={true} />
              </td>
              <td>
                <Skeleton
                  width="5rem"
                  onCard={true}
                  style={{ float: "right" }}
                />
              </td>
            </tr>
          ))}
        </Fragment>
      ))}
    </tbody>
  );
}

export default async function StateExpenditures() {
  const mapData = await fetchMapData();
  if (isError(mapData)) {
    return (
      <tbody>
        <tr>
          <td colSpan={3}>
            <ErrorText subject="expenditures by state" />
          </td>
        </tr>
      </tbody>
    );
  }
  const data = mapData as MapData;
  const states = Object.keys(data)
    .filter((k) => data[k].total > 0)
    .sort((a, b) => data[b].total - data[a].total);

  return (
    <tbody>
      {states.map((state) => {
        const stateName = STATES_BY_ABBR[state];
        const raceOrder = Object.keys(data[state].by_race).sort(
          (a, b) => data[state].by_race[b] - data[state].by_race[a],
        );
        return (
          <Fragment key={state}>
            <tr className={styles.headerRow}>
              <td colSpan={2} className="text-cell">
                <Link
                  href={`/states/${stateName.toLowerCase().replace(" ", "-")}`}
                >
                  {stateName}
                </Link>
              </td>
              <td className="number-cell">
                {formatCurrency(data[state].total, true)}
              </td>
            </tr>
            {raceOrder.map((raceKey) => {
              return (
                <tr key={raceKey}>
                  <td></td>
                  <td className="text-cell">
                    <Link href={`/elections/${raceKey}`}>
                      {getRaceName(raceKey)}
                    </Link>
                  </td>
                  <td className="number-cell">
                    {formatCurrency(data[state].by_race[raceKey], true)}
                  </td>
                </tr>
              );
            })}
          </Fragment>
        );
      })}
    </tbody>
  );
}
