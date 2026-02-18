import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import PartySupport from "@/app/components/PartySupport";
import SpendingByPartyWithOpposition, {
  SpendingByPartySkeleton,
} from "@/app/components/SpendingByPartyWithOpposition";
import sharedStyles from "@/app/shared.module.css";
import { ExpendituresByParty } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { customMetadata } from "@/app/utils/metadata";
import type { Metadata } from "next";
import { Suspense } from "react";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "PAC spending by party",
  description:
    "Cryptocurrency-focused spending in the 2026 election cycle, broken down by political party.",
});

async function SpendingByPartyWithOppositionChart() {
  const data = await fetchAllExpenditureTotalsByParty();
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  const expenditures = data as ExpendituresByParty;
  return (
    <SpendingByPartyWithOpposition
      expenditures={expenditures}
      labelId="expenditures-by-party-label"
    />
  );
}

async function PartySupportChart() {
  const data = await fetchAllExpenditureTotalsByParty();
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  const expenditures = data as ExpendituresByParty;
  return (
    <PartySupport
      expenditures={expenditures}
      labelId="expenditures-by-party-label"
    />
  );
}

export default function SpendingPage() {
  return (
    <section className={styles.column}>
      <h1>Spending by all committees</h1>
      <section className={sharedStyles.card}>
        <p>
          Cryptocurrency-focused PACs have contributed to both support and
          oppose candidates from Republican and Democratic parties.
        </p>
        <div className={styles.chartWrapper}>
          <Suspense fallback={<SpendingByPartySkeleton />}>
            <SpendingByPartyWithOppositionChart />
          </Suspense>
        </div>
        <p>
          However, spending to oppose Democrats does not always support
          Republicans, and vice versa. For example, when a PAC opposes a
          candidate in a primary against a candidate from the same party, they
          may be supporting a different candidate from the same party — or they
          may intend to support a candidate from the opposing party in a later
          election.
        </p>
        {/* <p>
          In some races where PACs have spent heavily to oppose candidates but
          have not supported any candidates, such as in{" "}
          <Link href="/elections/CA-S">California&rsquo;s Senate primary</Link>{" "}
          and in{" "}
          <Link href="/elections/NY-H-16">
            New York&rsquo;s District 16 Democratic primary
          </Link>
          , these PACs seem more focused on ousting candidates they view as
          anti-crypto, rather than supporting any specific candidate. The
          incidental beneficiaries in these cases are marked in lighter italic
          text in the table below.
        </p>
        <p>
          Based on committee support spending, individual contributions to other
          candidates, and statements supporting other candidates, opposition
          spending can be categorized based on likely beneficiary:
        </p>
        <div className={styles.chartWrapper}>
          <Suspense fallback={<PartySupportSkeleton />}>
            <PartySupportChart />
          </Suspense>
        </div>
        <Suspense fallback={<OppositionSpendingSkeleton />}>
          <OppositionSpending />
        </Suspense> */}
      </section>
    </section>
  );
}
