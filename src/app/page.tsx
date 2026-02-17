import { Suspense } from "react";
import InfluencedRaces from "./components/InfluencedRaces";
import { MoneyCardSkeleton } from "./components/MoneyCard";
import SuperPACsByReceipts from "./components/PACsByReceipts";
import SuperPACsByReceiptsTableContents from "./components/SuperPACsByReceiptsTableContents";
import AllCashByCommittee from "./components/home/AllCashByCommittee";
import AllCompanySpendingByParty from "./components/home/AllCompanySpendingByParty";
import AllCompanySpendingMap from "./components/home/AllCompanySpendingMap";
import AllExpendituresByCommittee from "./components/home/AllExpendituresByCommittee";
import AllExpendituresByParty from "./components/home/AllExpendituresByParty";
import AllRecentExpenditures from "./components/home/AllRecentExpenditures";
import SuperPacSpendingMapWrapper from "./components/home/SuperPacSpendingMapWrapper";
import TotalCompanySpending from "./components/home/TotalCompanySpending";
import TotalExpenditures from "./components/home/TotalExpenditures";
import TotalRaised from "./components/home/TotalRaised";
import USMapSkeleton from "./components/skeletons/USMapSkeleton";
import styles from "./page.module.css";
import sharedStyles from "./shared.module.css";

export default function Home() {
  return (
    <main className={sharedStyles.mainLayout}>
      <div className={styles.titleWrapper}>
        <span className={styles.logoArrow} aria-hidden={true}>
          &darr;
        </span>
        <div className={styles.title}>
          <h1 className={styles.titleH1}>Follow the crypto</h1>
        </div>
        <span className={styles.logoArrow} aria-hidden={true}>
          &darr;
        </span>
      </div>
      <div className={styles.totalsRow}>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <TotalCompanySpending />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <TotalRaised />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <TotalExpenditures />
        </Suspense>
      </div>
      <div className={styles.columns}>
        <div className={styles.mainColumn}>
          <InfluencedRaces />
          <div className={styles.companyMap}>
            <Suspense fallback={<USMapSkeleton />}>
              <AllCompanySpendingMap />
            </Suspense>
          </div>
          <div className={styles.superPacMap}>
            <Suspense fallback={<USMapSkeleton />}>
              <SuperPacSpendingMapWrapper />
            </Suspense>
          </div>
          <SuperPACsByReceipts type="super">
            <SuperPACsByReceiptsTableContents />
          </SuperPACsByReceipts>
        </div>
        <div className={styles.sideColumn}>
          <AllCompanySpendingByParty />
          <AllCashByCommittee />
          <AllExpendituresByCommittee />
          <AllExpendituresByParty />
          <AllRecentExpenditures />
        </div>
      </div>
    </main>
  );
}
