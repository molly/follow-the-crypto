import { fetchCommitteeTotalReceipts } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { TotalsForCommittees } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import ErrorText from "../ErrorText";
import MoneyCard from "../MoneyCard";

export default async function TotalRaised({
  className,
}: {
  className?: string;
}) {
  const receiptsData = await fetchCommitteeTotalReceipts();
  if (isError(receiptsData)) {
    return (
      <div className={`${sharedStyles.smallCard} ${className}`}>
        <ErrorText
          subject="the total amount of money raised by
        cryptocurrency-focused political action committees"
        />
      </div>
    );
  }
  const totals = receiptsData as TotalsForCommittees;
  const confirmedCash = totals.net_receipts + totals.cash_on_hand;

  let claimed;
  if (totals.claimed_committed) {
    claimed = (
      <p>{`They claim to have another ${humanizeRoundedCurrency(totals.claimed_committed, true)} committed.`}</p>
    );
  }
  const bottomText = <div>on hand to influence 2026 elections.{claimed}</div>;

  return (
    <MoneyCard
      topText="Cryptocurrency-focused political action committees have more than"
      amount={humanizeRoundedCurrency(confirmedCash, true)}
      bottomText={bottomText}
      className={className}
    />
  );
}
