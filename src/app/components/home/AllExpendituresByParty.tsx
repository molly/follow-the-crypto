import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import styles from "@/app/components/expendituresByParty.module.css";
import { ExpendituresByParty } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import SpendingByParty from "../SpendingByParty";

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
      <h2>Expenditures by all crypto PACs</h2>
      <Suspense fallback={<p>Loading...</p>}>
        <AllExpendituresByPartyContent />
      </Suspense>
    </section>
  );
}
