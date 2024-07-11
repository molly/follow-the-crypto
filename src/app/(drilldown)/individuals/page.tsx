import Skeleton from "@/app/components/skeletons/Skeleton";
import { range } from "@/app/utils/range";
import type { Metadata } from "next";
import { Suspense } from "react";
import IndividualsList from "./IndividualsList";

export const metadata: Metadata = {
  title: "Individuals | Follow the Crypto",
  description:
    "List of cryptocurrency-related individuals active in election spending.",
};

function IndividualsListSkeleton() {
  return range(20).map((x) => (
    <Skeleton
      key={`skeleton-row-${x}`}
      randWidth={[5, 15]}
      style={{ marginBottom: "1rem" }}
    />
  ));
}

export default async function IndividualsPage() {
  return (
    <section className="single-column-page">
      <h1>Cryptocurrency-related individuals active in election spending</h1>
      <Suspense fallback={<IndividualsListSkeleton />}>
        <IndividualsList />
      </Suspense>
    </section>
  );
}
