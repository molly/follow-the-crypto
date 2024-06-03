import { fetchCommitteeTotalDisbursements } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import MoneyCard from "../MoneyCard";

export default async function TotalDisbursements({
  className,
}: {
  className?: string;
}) {
  const disbursementsData = await fetchCommitteeTotalDisbursements();
  if (isError(disbursementsData)) {
    return <div>Error fetching data</div>;
  }
  const disbursements = disbursementsData as number;
  return (
    <MoneyCard
      topText={
        <div className={styles.spentTopSection}>They have spent more than</div>
      }
      amount={humanizeRoundedCurrency(disbursements)}
      bottomText="of it so far."
      className={className}
    />
  );
}
