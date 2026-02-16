import { fetchCompanyTotalSpending } from "@/app/actions/fetch";
import sharedStyles from "@/app/shared.module.css";
import { CompanyTotals } from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import ErrorText from "../ErrorText";
import InformationalTooltip from "../InformationalTooltip";
import MoneyCard from "../MoneyCard";

export default async function TotalCompanySpending({
  className,
}: {
  className?: string;
}) {
  const companyTotalsData = await fetchCompanyTotalSpending();
  if (isError(companyTotalsData)) {
    return (
      <div className={`${sharedStyles.smallCard} ${className}`}>
        <ErrorText subject="the total amount of money contributed by cryptocurrency-associated companies and individuals" />
      </div>
    );
  }
  const spending = companyTotalsData as CompanyTotals;
  return (
    <MoneyCard
      topText="Cryptocurrency industry companies and associated individuals have spent"
      amount={humanizeRoundedCurrency(spending.total, true)}
      bottomText="to influence 2026 elections."
      tooltip={
        <InformationalTooltip>
          This includes contributions to cryptocurrency-focused PACs, as well as
          direct contributions to other candidates and committees.
        </InformationalTooltip>
      }
      className={className}
    />
  );
}
