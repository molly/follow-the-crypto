import { fetchAllRaceIds } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { STATES_BY_ABBR } from "@/app/data/states";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { range } from "@/app/utils/range";
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
  const allRaceIdsData = await fetchAllRaceIds();
  if (isError(allRaceIdsData)) {
    return (
      <tbody>
        <tr>
          <td colSpan={3}>
            <ErrorText subject="direct contributions by state" />
          </td>
        </tr>
      </tbody>
    );
  }
  const data = allRaceIdsData as Record<string, string[]>;
  const states = Object.keys(data).sort();

  return (
    <tbody>
      {states.map((state) => {
        const stateName = STATES_BY_ABBR[state];
        if (!stateName) {
          return null;
        }
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
            </tr>
            {data[state].map((raceId) => {
              return (
                <tr key={`${state}-${raceId}`}>
                  <td></td>
                  <td className="text-cell">
                    <Link href={`/elections/${state}-${raceId}`}>
                      {getRaceName(raceId)}
                    </Link>
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
