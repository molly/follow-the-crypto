import { fetchCommitteeTotalReceipts } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { TotalsForCommittees } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { type Sector } from "@/app/types/Sector";
import { humanizeSector } from "@/app/utils/sector";
import ErrorText from "../ErrorText";
import MoneyCard from "../MoneyCard";

export default async function TotalRaised({
  className,
  sector,
}: {
  className?: string;
  sector: Sector;
}) {
  const receiptsData = await fetchCommitteeTotalReceipts();
  const sectorText = humanizeSector(sector, {
    context: "industry",
    abbrev: true,
  });
  if (isError(receiptsData)) {
    return (
      <div className={`${sharedStyles.smallCard} ${className}`}>
        <ErrorText
          subject={`the total amount of money raised by ${sectorText.toLowerCase()}-focused political action committees`}
        />
      </div>
    );
  }
  const totals = receiptsData as TotalsForCommittees;
  const confirmedCash = totals.net_receipts + totals.cash_on_hand;

  let claimed;
  if (totals.claimed_committed) {
    claimed = ` They claim to have another ${humanizeRoundedCurrency(totals.claimed_committed, true)} committed.`;
  }
  const bottomText = <div>on hand to influence 2026 elections.{claimed}</div>;

  return (
    <MoneyCard
      topText={` ${sectorText} political action committees have more than`}
      amount={humanizeRoundedCurrency(confirmedCash, true)}
      bottomText={bottomText}
      className={className}
    />
  );
}
