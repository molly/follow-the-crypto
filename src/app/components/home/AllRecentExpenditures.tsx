import { fetchAllRecentExpenditures, fetchConstant } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import RecentExpenditures from "../RecentExpenditures";
import RecentExpendituresContent, {
  RecentExpendituresContentSkeleton,
} from "../RecentExpendituresContent";

async function AllRecentExpendituresContent({
  fullPage,
}: {
  fullPage?: boolean;
}) {
  const [expendituresData, committeeConstantData] = await Promise.all([
    fetchAllRecentExpenditures(),
    fetchConstant("committees"),
  ]);
  if (isError(expendituresData)) {
    return <div>Something went wrong when fetching recent expenditures.</div>;
  }

  const allRecentExpenditures = expendituresData as Expenditure[];
  return (
    <RecentExpendituresContent
      expenditures={
        fullPage ? allRecentExpenditures : allRecentExpenditures.slice(0, 5)
      }
      committees={committeeConstantData as Record<string, CommitteeConstant>}
    />
  );
}

export default async function AllRecentExpenditures({
  fullPage,
}: {
  fullPage?: boolean;
}) {
  return (
    <RecentExpenditures
      className={styles.recentExpenditures}
      noHeader={fullPage}
      fullPage={fullPage}
    >
      <Suspense fallback={<RecentExpendituresContentSkeleton />}>
        <AllRecentExpendituresContent fullPage={fullPage} />
      </Suspense>
    </RecentExpenditures>
  );
}
