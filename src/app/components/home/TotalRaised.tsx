import { fetchCommitteeTotalReceipts } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
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
  const receipts = receiptsData as number;
  return (
    <MoneyCard
      topText="Cryptocurrency-focused political action committees have more than"
      amount={humanizeRoundedCurrency(receipts, true)}
      bottomText="to influence 2024 elections."
      className={className}
    />
  );
}
