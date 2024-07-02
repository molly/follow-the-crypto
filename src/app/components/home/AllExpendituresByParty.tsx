import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import SpendingByParty from "@/app/components/SpendingByParty";
import styles from "@/app/components/expenditures.module.css";
import { ExpendituresByParty } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import ExpendituresSkeleton from "../skeletons/ExpendituresSkeleton";

async function AllExpendituresByPartyContent() {
  const data = await fetchAllExpenditureTotalsByParty();
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  return <SpendingByParty expenditures={data as ExpendituresByParty} />;
}

export default function AllExpendituresByParty() {
  return (
    <section className={styles.card}>
      <h2>All crypto industry expenditures by party</h2>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllExpendituresByPartyContent />
      </Suspense>
    </section>
  );
}
