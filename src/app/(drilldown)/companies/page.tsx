import Skeleton from "@/app/components/skeletons/Skeleton";
import { range } from "@/app/utils/range";
import { Suspense } from "react";
import CompanyList from "./CompanyList";

function CompanyListSkeleton() {
  return range(10).map((x) => (
    <Skeleton
      key={`skeleton-row-${x}`}
      randWidth={[5, 15]}
      style={{ marginBottom: "1rem" }}
    />
  ));
}

export default async function CompaniesPage() {
  return (
    <section>
      <h1>Cryptocurrency-related companies active in election spending</h1>
      <Suspense fallback={<CompanyListSkeleton />}>
        <CompanyList />
      </Suspense>
    </section>
  );
}
