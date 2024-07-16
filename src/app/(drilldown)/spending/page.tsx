import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import PartySupport, {
  PartySupportSkeleton,
} from "@/app/components/PartySupport";
import SpendingByPartyWithOpposition, {
  SpendingByPartySkeleton,
} from "@/app/components/SpendingByPartyWithOpposition";
import sharedStyles from "@/app/shared.module.css";
import { ExpendituresByParty } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import OppositionSpending, {
  OppositionSpendingSkeleton,
} from "./OppositionSpending";
import styles from "./page.module.css";

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
        </Suspense>
      </section>
    </section>
  );
}
