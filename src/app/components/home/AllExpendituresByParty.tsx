import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import pageStyles from "@/app/page.module.css";
import styles from "@/app/shared.module.css";
import { ExpendituresByParty } from "@/app/types/Expenditures";
import { Sector } from "@/app/types/Sector";
import { isError } from "@/app/utils/errors";
import { humanizeSector } from "@/app/utils/sector";
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

export default function AllExpendituresByParty({ sector }: { sector: Sector }) {
  const sectorText = humanizeSector(sector, {
    abbrev: true,
    lowercase: true,
    hyphen: true,
  });
  return (
    <section className={styles.section}>
      <h2 id="expenditures-by-party-label">PAC expenditures by party</h2>
      <div className={pageStyles.subtitle}>
        Independent expenditures by {sectorText}focused PACs in support of or
        opposition to candidates
      </div>
      <Suspense fallback={<ExpendituresSkeleton />}>
        <AllExpendituresByPartyContent labelId="expenditures-by-party-label" />
      </Suspense>
      <div className={styles.linkRow}>
        <Link href="/2026/spending">&raquo; More details</Link>
      </div>
    </section>
  );
}
