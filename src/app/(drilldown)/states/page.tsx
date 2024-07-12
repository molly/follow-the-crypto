import MapWrapper from "@/app/components/home/MapWrapper";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import type { Metadata } from "next";
import { Suspense } from "react";
import StateExpenditures, {
  StateExpendituresSkeleton,
} from "./StateExpenditures";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Spending by State | Follow the Crypto",
  description:
    "States in which cryptocurrency-focused political action committees have been spending to influence 2024 elections.",
};

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.mapContainer}>
        <Suspense fallback={<USMapSkeleton />}>
          <MapWrapper />
        </Suspense>
      </div>
      <section className={styles.statesTableCard}>
        <h2 className={styles.statesTableHeader}>
          Cryptocurrency PAC spending by state
        </h2>
        <table className={styles.statesTable}>
          <thead>
            <tr>
              <th className="text-cell" colSpan={2}>
                State
              </th>
              <th className="number-cell">Expenditures</th>
            </tr>
          </thead>
          <Suspense fallback={<StateExpendituresSkeleton />}>
            <StateExpenditures />
          </Suspense>
        </table>
      </section>
    </div>
  );
}
