import {
  fetchCommitteeDonors,
  fetchCommitteeTotalExpenditures,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import InformationalTooltip from "@/app/components/InformationalTooltip";
import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { Contributions } from "@/app/types/Contributions";
import { CommitteeTotalExpenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";
import styles from "./page.module.css";

export default async function CommitteeExpendituresTotal({
  committeeId,
}: {
  committeeId: string;
}) {
  let [totalData, donorData] = await Promise.all([
    fetchCommitteeTotalExpenditures(committeeId),
    fetchCommitteeDonors(committeeId),
  ]);
  if (isError(totalData) && !is4xx(totalData)) {
    return (
      <div className={sharedStyles.smallCard}>
        <ErrorText subject="the total expenditures by this committee" />
      </div>
    );
  }
  const totals = totalData as CommitteeTotalExpenditures;
  const expenditures = totals.expenditures || 0;
  const disbursements = totals.disbursements || 0;
  let bottomText = "of it so far.";
  if (disbursements > 0) {
    bottomText += ` They have also transferred ${formatCurrency(disbursements, true)} to other crypto-focused committees.`;
  }

  let tooltip;
  if (!isError(donorData)) {
    const donors = donorData as Contributions;
    const total = donors.total_contributed + donors.total_transferred;
    if (total < expenditures + disbursements) {
      tooltip = (
        <InformationalTooltip>
          <span>
            Due to different reporting frequencies for receipts and
            expenditures, committees sometimes appear to have spent more than
            they have raised.
          </span>
        </InformationalTooltip>
      );
    }
  }

  return (
    <MoneyCard
      amount={formatCurrency(expenditures, true)}
      topText="They have spent"
      bottomText={bottomText}
      tooltip={tooltip}
      className={styles.justifyTop}
    />
  );
}
