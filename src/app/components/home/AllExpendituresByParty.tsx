import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import styles from "@/app/shared.module.css";
import { ExpendituresByParty } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import Link from "next/link";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import ExpendituresSkeleton from "../skeletons/ExpendituresSkeleton";
import SpendingByPartyWithOpposition from "../SpendingByPartyWithOpposition";

async function AllExpendituresByPartyContent({ labelId }: { labelId: string }) {
  const data = await fetchAllExpenditureTotalsByParty();
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  return (
    <SpendingByPartyWithOpposition
      expenditures={data as ExpendituresByParty}
      labelId={labelId}
    />
  );
}

export default function AllExpendituresByParty() {
  return (
    <section className={styles.section}>
      <h2 id="expenditures-by-party-label">
        PAC expenditures by political outcome
      </h2>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllExpendituresByPartyContent labelId="expenditures-by-party-label" />
      </Suspense>
      <div className={styles.linkRow}>
        <Link href="/2026/spending">&raquo; More details</Link>
      </div>
    </section>
  );
}
