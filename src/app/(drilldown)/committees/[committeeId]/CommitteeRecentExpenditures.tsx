import {
  fetchCommitteeDetails,
  fetchRecentCommitteeExpenditures,
} from "@/app/actions/fetch";
import RecentExpenditures from "@/app/components/RecentExpenditures";
import RecentExpendituresContent, {
  RecentExpendituresContentSkeleton,
} from "@/app/components/RecentExpendituresContent";
import { CommitteeDetails } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";

export async function CommitteeRecentExpendituresContent({
  committeeId,
}: {
  committeeId: string;
}) {
  const [committeeData, expendituresData] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchRecentCommitteeExpenditures(committeeId),
  ]);
  if (isError(expendituresData) || isError(committeeData)) {
    return <div>Something went wrong when fetching recent expenditures.</div>;
  }

  const committeeExpenditures = expendituresData as Expenditure[];
  const committee = committeeData as CommitteeDetails;
  if (!committeeExpenditures.length) {
    return <div>No recent expenditures found for this committee.</div>;
  }
  return <RecentExpendituresContent expenditures={committeeExpenditures} />;
}

export default function CommitteeRecentExpenditures({
  committeeId,
}: {
  committeeId: string;
}) {
  return (
    <RecentExpenditures fullPage={true}>
      <Suspense fallback={<RecentExpendituresContentSkeleton />}>
        <CommitteeRecentExpendituresContent committeeId={committeeId} />
      </Suspense>
    </RecentExpenditures>
  );
}
