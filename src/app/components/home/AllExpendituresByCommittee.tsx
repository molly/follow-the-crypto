import {
  fetchAllCommitteeExpenditures,
  fetchConstant,
} from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import ExpendituresSkeleton from "../skeletons/ExpendituresSkeleton";
import AllExpendituresByCommitteeChart from "./AllExpendituresByCommitteeChart";

async function AllExpendituresByCommitteeContent({
  labelId,
}: {
  labelId: string;
}) {
  const [expendituresData, committeeConstantData] = await Promise.all([
    fetchAllCommitteeExpenditures(),
    fetchConstant<Record<string, CommitteeConstant>>("committees"),
  ]);
  if (isError(expendituresData)) {
    return <ErrorText subject="expenditures by party" />;
  }
  const committeeConstants = committeeConstantData || {};
  return (
    <AllExpendituresByCommitteeChart
      expenditures={expendituresData as Record<string, number>}
      committeeConstants={committeeConstants}
      labelId={labelId}
    />
  );
}

export default function AllExpendituresByCommittee() {
  return (
    <section className={styles.expendituresByCommitteeCard}>
      <h2 id="expenditures-by-committee-label">Expenditures by committee</h2>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllExpendituresByCommitteeContent labelId="expenditures-by-committee-label" />
      </Suspense>
    </section>
  );
}
