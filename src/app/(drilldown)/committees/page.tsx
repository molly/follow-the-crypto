import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
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
    <section className={sharedStyles.fullWidth}>
      <h1>Committees</h1>
      <Suspense fallback={<CommitteeListSkeleton />}>
        <CommitteeList />
      </Suspense>
    </section>
  );
}
