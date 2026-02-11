import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import styles from "@/app/components/expenditures.module.css";
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
    <section className={styles.card}>
      <h2 id="expenditures-by-party-label">
        All crypto PAC expenditures by party
      </h2>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllExpendituresByPartyContent labelId="expenditures-by-party-label" />
      </Suspense>
      <Link href="/spending">&raquo; More details</Link>
    </section>
  );
}
