import Skeleton from "@/app/components/skeletons/Skeleton";
import { range } from "@/app/utils/range";
import { Suspense } from "react";
import CommitteeList from "./CommitteeList";

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
    <section>
      <h1>Committees</h1>
      <Suspense fallback={<CommitteeListSkeleton />}>
        <CommitteeList />
      </Suspense>
    </section>
  );
}
