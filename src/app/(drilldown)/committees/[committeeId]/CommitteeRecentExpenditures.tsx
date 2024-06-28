import { fetchRecentCommitteeExpenditures } from "@/app/actions/fetch";
import RecentExpenditures from "@/app/components/RecentExpenditures";
import RecentExpendituresContent, {
  RecentExpendituresContentSkeleton,
} from "@/app/components/RecentExpendituresContent";
import tableStyles from "@/app/components/tables.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import {
  Expenditure,
  RecentCommitteeExpenditures,
} from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";

export async function CommitteeRecentExpendituresContent({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  const data = await fetchRecentCommitteeExpenditures(committee.id);
  if (isError(data)) {
    return <div>Something went wrong when fetching recent expenditures.</div>;
  }

  const committeesExpenditures = data as Record<
    string,
    RecentCommitteeExpenditures
  >;
  if (!(committee.id in committeesExpenditures)) {
    return <div>No recent expenditures found for this committee.</div>;
  }
  const recentExpenditures = committeesExpenditures[committee.id][
    "recent"
  ] as Expenditure[];
  return <RecentExpendituresContent expenditures={recentExpenditures} />;
}

export default async function CommitteeRecentExpenditures({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  return (
    <RecentExpenditures expendituresClassName={tableStyles.overflowWrapper}>
      <Suspense fallback={<RecentExpendituresContentSkeleton />}>
        <CommitteeRecentExpendituresContent committee={committee} />
      </Suspense>
    </RecentExpenditures>
  );
}
