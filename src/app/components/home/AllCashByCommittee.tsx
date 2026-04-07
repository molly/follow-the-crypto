import { fetchCommitteesWithContributions } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { CommitteeConstantWithContributions } from "@/app/types/Committee";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import ExpendituresSkeleton from "../skeletons/ExpendituresSkeleton";
import AllCashByCommitteeChart from "./AllCashByCommitteeChart";

async function AllCashByCommitteeContent({
  labelId,
  sector,
}: {
  labelId: string;
  sector: Sector;
}) {
  const [committeesData] = await Promise.all([
    fetchCommitteesWithContributions(sector),
  ]);
  if (isError(committeesData)) {
    return <ErrorText subject="receipts by committee" />;
  }
  return (
    <AllCashByCommitteeChart
      committees={committeesData as CommitteeConstantWithContributions[]}
      labelId={labelId}
      sector={sector}
    />
  );
}

export default function AllCashByCommittee({ sector }: { sector: Sector }) {
  return (
    <section className={styles.allCashCard}>
      <h2 id="cash-by-committee-label">PAC funds on hand</h2>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllCashByCommitteeContent labelId="cash-by-committee-label" sector={sector} />
      </Suspense>
    </section>
  );
}
