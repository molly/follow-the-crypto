import Skeleton from "@/app/components/skeletons/Skeleton";
import { range } from "@/app/utils/range";
import type { Metadata } from "next";
import { Suspense } from "react";
import CommitteeList from "./CommitteeList";

export const metadata: Metadata = {
  title: "Cryptocurrency-focused PACs | Follow the Crypto",
  description:
    "Political action committees that focus on cryptocurrency and blockchain advocacy.",
};

function CommitteeListSkeleton() {
  return range(10).map((x) => (
    <Skeleton
      key={`skeleton-row-${x}`}
      randWidth={[5, 15]}
      style={{ marginBottom: "1rem" }}
    />
  ));
}

export default async function CommitteesPage() {
  return (
    <section className="single-column-page">
      <h1>Cryptocurrency-focused political action committees</h1>
      <Suspense fallback={<CommitteeListSkeleton />}>
        <CommitteeList />
      </Suspense>
    </section>
  );
}
