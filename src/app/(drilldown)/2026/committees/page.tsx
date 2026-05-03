import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";
import { range } from "@/app/utils/range";
import { humanizeSector, parseSector } from "@/app/utils/sector";
import type { Metadata } from "next";
import { Suspense } from "react";
import CommitteeList from "./CommitteeList";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}): Promise<Metadata> {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);
  return customMetadata({
    title: `${humanizeSector(sector, { abbrev: true })} PACs`,
    description: `Political action committees that focus on ${humanizeSector(sector, { context: "industry", lowercase: true })} advocacy.`,
  });
}

function CommitteeListSkeleton() {
  return range(10).map((x) => (
    <Skeleton
      key={`skeleton-row-${x}`}
      randWidth={[5, 15]}
      className={sharedStyles.marginBottom1}
    />
  ));
}

export default async function CommitteesPage({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string }>;
}) {
  const { sector: rawSector } = await searchParams;
  const sector = parseSector(rawSector);

  return (
    <section className="single-column-page">
      <h1>{`${humanizeSector(sector)} PACs`}</h1>
      <Suspense fallback={<CommitteeListSkeleton />}>
        <CommitteeList sector={sector} />
      </Suspense>
    </section>
  );
}
