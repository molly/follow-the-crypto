import { fetchCommitteeTotalReceipts } from "@/app/actions/fetch";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import MoneyCard from "../MoneyCard";

export default async function TotalRaised({
  className,
}: {
  className?: string;
}) {
  const receiptsData = await fetchCommitteeTotalReceipts();
  if (isError(receiptsData)) {
    return <div>Error fetching data</div>;
  }
  const receipts = receiptsData as number;
  return (
    <MoneyCard
      topText="Cryptocurrency companies and associated people have raised more than"
      amount={humanizeRoundedCurrency(receipts)}
      bottomText="to influence 2024 elections."
      className={className}
    />
  );
}
