import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyTotals } from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { type Sector } from "@/app/types/Sector";
import { humanizeSector } from "@/app/utils/sector";
import ErrorText from "../ErrorText";
import InformationalTooltip from "../InformationalTooltip";
import MoneyCard from "../MoneyCard";

export default async function TotalCompanySpending({
  className,
  sector,
}: {
  className?: string;
  sector: Sector;
}) {
  const companyTotalsData = await fetchCompanyTotalSpending();
  const sectorText = humanizeSector(sector, { context: "industry" });
  if (isError(companyTotalsData)) {
    return (
      <div className={`${sharedStyles.smallCard} ${className}`}>
        <ErrorText
          subject={`the total amount of money contributed by ${sectorText.toLowerCase()} companies and individuals`}
        />
      </div>
    );
  }
  const spending = companyTotalsData as CompanyTotals;
  return (
    <MoneyCard
      topText={`${sectorText} companies and associated individuals have spent more than`}
      amount={humanizeRoundedCurrency(spending.total, true)}
      bottomText="to influence 2026 elections."
      tooltip={
        <InformationalTooltip>
          {`This includes contributions to ${sectorText.toLowerCase()}-focused PACs, as well as direct contributions to other candidates and committees. This relies on manual classification and so represents a conservative estimate of industry spending.`}
        </InformationalTooltip>
      }
      className={className}
    />
  );
}
