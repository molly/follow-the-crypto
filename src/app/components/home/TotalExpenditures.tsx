import { fetchAllCommitteeTotalExpenditures } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { humanizeSector, type Sector } from "@/app/utils/sector";
import ErrorText from "../ErrorText";
import MoneyCard from "../MoneyCard";

export default async function TotalDisbursements({
  className,
  sector,
}: {
  className?: string;
  sector: Sector;
}) {
  const expendituresData = await fetchAllCommitteeTotalExpenditures();
  const sectorText = humanizeSector(sector, { abbrev: true });
  if (isError(expendituresData)) {
    return (
      <div className={`secondary ${sharedStyles.smallCard} ${className}`}>
        <ErrorText subject={`the total expenditures by ${sectorText} PACs`} />
      </div>
    );
  }
  const expenditures = expendituresData as number;
  return (
    <MoneyCard
      topText={
        <div className={styles.spentTopSection}>
          {sectorText}-focused PACs have spent more than
        </div>
      }
      amount={humanizeRoundedCurrency(expenditures, true)}
      bottomText="on elections so far this cycle."
      className={className}
    />
  );
}
