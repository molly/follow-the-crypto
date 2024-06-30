import { fetchAllRecentExpenditures, fetchConstant } from "@/app/actions/fetch";
import tableStyles from "@/app/components/tables.module.css";
import styles from "@/app/page.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import RecentExpenditures from "../RecentExpenditures";
import RecentExpendituresContent, {
  RecentExpendituresContentSkeleton,
} from "../RecentExpendituresContent";

async function AllRecentExpendituresContent() {
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
      expenditures={allRecentExpenditures}
      committees={committeeConstantData as Record<string, CommitteeConstant>}
    />
  );
}

export default async function AllRecentExpenditures() {
  return (
    <RecentExpenditures
      className={styles.recentExpenditures}
      expendituresClassName={`${tableStyles.overflowWrapper} ${styles.recentExpendituresWrapper}`}
    >
      <Suspense fallback={<RecentExpendituresContentSkeleton />}>
        <AllRecentExpendituresContent />
      </Suspense>
    </RecentExpenditures>
  );
}
