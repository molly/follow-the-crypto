import { fetchCommitteesWithContributions } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { CommitteeConstantWithContributions } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import ExpendituresSkeleton from "../skeletons/ExpendituresSkeleton";
import AllCashByCommitteeChart from "./AllCashByCommitteeChart";

async function AllCashByCommitteeContent({ labelId }: { labelId: string }) {
  const [committeesData] = await Promise.all([
    fetchCommitteesWithContributions(),
  ]);
  if (isError(committeesData)) {
    return <ErrorText subject="receipts by committee" />;
  }
  return (
    <AllCashByCommitteeChart
      committees={committeesData as CommitteeConstantWithContributions[]}
      labelId={labelId}
    />
  );
}

export default function AllCashByCommittee() {
  return (
    <section className={styles.allCashCard}>
      <h2 id="cash-by-committee-label">Cryptocurrency PAC funds on hand</h2>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllCashByCommitteeContent labelId="cash-by-committee-label" />
      </Suspense>
    </section>
  );
}
