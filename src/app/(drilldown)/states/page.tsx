import SuperPacSpendingMapWrapper from "@/app/components/home/SuperPacSpendingMapWrapper";
import USMapSkeleton from "@/app/components/skeletons/USMapSkeleton";
import { customMetadata } from "@/app/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import StateExpenditures, {
  StateExpendituresSkeleton,
} from "./StateExpenditures";
import StateNonPacExpenditures from "./StateNonPacExpenditures";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Spending by State",
  description:
    "States in which cryptocurrency-focused political action committees have been spending to influence 2026 elections.",
});

export default function Page() {
  return (
    <div className={styles.page}>
      <div className={styles.mapContainer}>
        <Suspense fallback={<USMapSkeleton />}>
          <SuperPacSpendingMapWrapper />
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
      <section className={styles.statesTableCard}>
        <h2 className={styles.statesTableHeader}>
          Elections with spending by cryptocurrency industry-associated
          companies or individuals
        </h2>
        <table className={styles.statesTable}>
          <thead>
            <tr>
              <th className="text-cell" colSpan={2}>
                State
              </th>
            </tr>
          </thead>
          <Suspense fallback={<StateExpendituresSkeleton />}>
            <StateNonPacExpenditures />
          </Suspense>
        </table>
      </section>
    </div>
  );
}
