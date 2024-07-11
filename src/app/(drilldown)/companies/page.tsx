import Skeleton from "@/app/components/skeletons/Skeleton";
import { range } from "@/app/utils/range";
import type { Metadata } from "next";
import { Suspense } from "react";
import CompanyList from "./CompanyList";

export const metadata: Metadata = {
  title: "Companies | Follow the Crypto",
  description:
    "List of cryptocurrency-related companies active in election spending.",
};

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
      <h1 className="no-margin">
        Cryptocurrency-related companies active in election spending
      </h1>
      <Suspense fallback={<CompanyListSkeleton />}>
        <CompanyList />
      </Suspense>
    </section>
  );
}
