import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { CompanyTotals } from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import ErrorText from "../ErrorText";
import HorizontalPartyBars from "./HorizontalPartyBars";

async function AllCompanySpendingByPartyContent() {
  const data = await fetchCompanyTotalSpending();
  if (isError(data)) {
    return <ErrorText subject="company spending by party" />;
  }
  const summary = data as CompanyTotals;
  const { DEM, REP, UNK, ...rest } = summary.by_party;
  const partySummary = {
    DEM,
    REP,
    UNK,
    OTH: Object.values(rest).reduce((acc, amt) => acc + amt, 0),
  };
  return <HorizontalPartyBars partySummary={partySummary} />;
}

export default function AllCompanySpendingByParty() {
  return (
    <section className={styles.companySpendingCard}>
      <h2 id="company-spending-by-party-label">Contributions by party</h2>
      <Suspense fallback={null}>
        <AllCompanySpendingByPartyContent />
      </Suspense>
    </section>
  );
}
