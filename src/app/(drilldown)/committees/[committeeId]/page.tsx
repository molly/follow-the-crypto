import { Metadata } from "next";

import { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { SpendingByPartySkeleton } from "@/app/components/SpendingByPartyWithOpposition";
import COMMITTEES from "@/app/data/committees";
import sharedStyles from "@/app/shared.module.css";
import { customMetadata } from "@/app/utils/metadata";
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

export async function generateMetadata({
  params,
}: {
  params: { committeeId: string };
}): Promise<Metadata> {
  const { committeeId } = await params;
  let committeeName =
    committeeId in COMMITTEES ? COMMITTEES[committeeId] : committeeId;
  return customMetadata({
    title: committeeName,
    description: `Election activity by the ${committeeName} PAC`,
  });
}

export default async function CommitteePage({
  params,
}: {
  params: { committeeId: string };
}) {
  const { committeeId } = await params;
  return (
    <div className={styles.page}>
      <Suspense fallback={<CommitteeDetailsSkeleton />}>
        <CommitteeDetailsSection committeeId={committeeId} />
      </Suspense>
      <section className={styles.moneyCardRow}>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CommitteeRaised committeeId={committeeId} />
        </Suspense>
        <Suspense fallback={<MoneyCardSkeleton />}>
          <CommitteeExpendituresTotal committeeId={committeeId} />
        </Suspense>
      </section>
      <div className={styles.committeeWrapper}>
        <section className={styles.donorSection}>
          <h3 className={styles.donorSectionHeader}>Top donors</h3>
          <Suspense fallback={<TopDonorsSkeleton />}>
            <TopDonors committeeId={committeeId} />
          </Suspense>
        </section>
        <div className={styles.rightColumn}>
          <div className={sharedStyles.constrainedWrapper}>
            <section
              className={`${sharedStyles.card} ${sharedStyles.constrainWidth}`}
            >
              <h2 id="expenditures-label">Expenditures</h2>
              <Suspense fallback={<SpendingByPartySkeleton />}>
                <CommitteeExpendituresByParty committeeId={committeeId} />
              </Suspense>
            </section>
            <Suspense fallback={null}>
              <CommitteeDisbursements committeeId={committeeId} />
            </Suspense>
          </div>
          <CommitteeRecentExpenditures committeeId={committeeId} />
        </div>
      </div>
    </div>
  );
}
