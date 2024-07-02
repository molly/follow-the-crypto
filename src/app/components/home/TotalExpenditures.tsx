import { fetchAllCommitteeTotalExpenditures } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import ErrorText from "../ErrorText";
import MoneyCard from "../MoneyCard";

export default async function TotalDisbursements({
  className,
}: {
  className?: string;
}) {
  const expendituresData = await fetchAllCommitteeTotalExpenditures();
  if (isError(expendituresData)) {
    return (
      <div className={`secondary ${sharedStyles.smallCard} ${className}`}>
        <ErrorText subject="the total expenditures by cryptocurrency PACs" />
      </div>
    );
  }
  const expenditures = expendituresData as number;
  return (
    <MoneyCard
      topText={
        <div className={styles.spentTopSection}>They have spent more than</div>
      }
      amount={humanizeRoundedCurrency(expenditures)}
      bottomText="of it so far."
      className={className}
    />
  );
}
