import { fetchAllExpenditureTotalsByParty } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import PartySupport from "@/app/components/PartySupport";
import SpendingByPartyWithOpposition from "@/app/components/SpendingByPartyWithOpposition";
import sharedStyles from "@/app/shared.module.css";
import { ExpendituresByParty } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { Suspense } from "react";
import OppositionSpending from "./OppositionSpending";
import styles from "./page.module.css";

export default async function SpendingPage() {
  const data = await fetchAllExpenditureTotalsByParty();
  if (isError(data)) {
    return <ErrorText subject="expenditures by party" />;
  }
  const expenditures = data as ExpendituresByParty;
  return (
    <section className={styles.column}>
      <h1>Spending by all committees</h1>
      <section className={sharedStyles.card}>
        <p>
          Cryptocurrency-focused PACs have contributed to both support and
          oppose candidates from Republican and Democratic parties.
        </p>
        <div className={styles.chartWrapper}>
          <SpendingByPartyWithOpposition
            expenditures={expenditures}
            labelId="expenditures-by-party-label"
          />
        </div>
        <p>
          However, spending to oppose Democrats does not always support
          Republicans, and vice versa. For example, when a PAC opposes a
          candidate in a primary against a candidate from the same party, they
          may be supporting a different candidate from the same party — or they
          may intend to support a candidate from the opposing party in a later
          election.
        </p>
        <p></p>
        <div className={styles.chartWrapper}>
          <PartySupport
            expenditures={expenditures}
            labelId="expenditures-by-party-label"
          />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <OppositionSpending />
        </Suspense>
      </section>
    </section>
  );
}
