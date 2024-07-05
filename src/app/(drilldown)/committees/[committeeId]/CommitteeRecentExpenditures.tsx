import { fetchRecentCommitteeExpenditures } from "@/app/actions/fetch";
import RecentExpenditures from "@/app/components/RecentExpenditures";
import RecentExpendituresContent, {
  RecentExpendituresContentSkeleton,
} from "@/app/components/RecentExpendituresContent";
import { CommitteeDetails } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
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

  const committeeExpenditures = data as Expenditure[];
  if (!committeeExpenditures.length) {
    return <div>No recent expenditures found for this committee.</div>;
  }
  return <RecentExpendituresContent expenditures={committeeExpenditures} />;
}

export default async function CommitteeRecentExpenditures({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  return (
    <RecentExpenditures>
      <Suspense fallback={<RecentExpendituresContentSkeleton />}>
        <CommitteeRecentExpendituresContent committee={committee} />
      </Suspense>
    </RecentExpenditures>
  );
}
