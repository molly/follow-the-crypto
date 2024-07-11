import { Metadata } from "next";

import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { SpendingByPartySkeleton } from "@/app/components/SpendingByParty";
import COMMITTEES from "@/app/data/committees";
import sharedStyles from "@/app/shared.module.css";
import { Suspense } from "react";
import CommitteeDetailsSection, {
  CommitteeDetailsSkeleton,
} from "./CommitteeDetailsSection";
import CommitteeDisbursements from "./CommitteeDisbursements";
import CommitteeExpendituresByParty from "./CommitteeExpendituresByParty";
import CommitteeExpendituresTotal from "./CommitteeExpendituresTotal";
import CommitteeRaised from "./CommitteeRaised";
import CommitteeRecentExpenditures from "./CommitteeRecentExpenditures";
import TopDonors, { TopDonorsSkeleton } from "./TopDonors";
import styles from "./page.module.css";

export function generateMetadata({
  params,
}: {
  params: { committeeId: string };
}): Metadata {
  let committeeName =
    params.committeeId in COMMITTEES
      ? COMMITTEES[params.committeeId]
      : params.committeeId;
  return {
    title: `${committeeName} | Follow the Crypto`,
    description: `Election activity by the ${committeeName} PAC`,
  };
}

export default function CommitteePage({
  params,
}: {
  params: { committeeId: string };
}) {
  return (
    <div className={styles.page}>
      <Suspense fallback={<CommitteeDetailsSkeleton />}>
        <CommitteeDetailsSection committeeId={params.committeeId} />
      </Suspense>
      <section className={styles.moneyCardRow}>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CommitteeRaised committeeId={params.committeeId} />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CommitteeExpendituresTotal committeeId={params.committeeId} />
        </Suspense>
      </section>
      <div className={styles.committeeWrapper}>
        <section className={styles.donorSection}>
          <h3 className={styles.donorSectionHeader}>Top donors</h3>
          <Suspense fallback={<TopDonorsSkeleton />}>
            <TopDonors committeeId={params.committeeId} />
          </Suspense>
        </section>
        <div className={styles.rightColumn}>
          <div className={sharedStyles.constrainedWrapper}>
            <section
              className={`${sharedStyles.card} ${sharedStyles.constrainWidth}`}
            >
              <h2 id="expenditures-label">Expenditures</h2>
              <Suspense fallback={<SpendingByPartySkeleton />}>
                <CommitteeExpendituresByParty
                  committeeId={params.committeeId}
                />
              </Suspense>
            </section>
            <Suspense fallback={null}>
              <CommitteeDisbursements committeeId={params.committeeId} />
            </Suspense>
          </div>
          <CommitteeRecentExpenditures committeeId={params.committeeId} />
        </div>
      </div>
    </div>
  );
}
