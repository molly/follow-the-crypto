import { fetchCommitteeTotalExpenditures } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard from "@/app/components/MoneyCard";
import sharedStyles from "@/app/shared.module.css";
import { is4xx, isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";

export default async function CommitteeExpendituresTotal({
  committeeId,
}: {
  committeeId: string;
}) {
  let totalData = await fetchCommitteeTotalExpenditures(committeeId);
  if (isError(totalData) && !is4xx(totalData)) {
    return (
      <div className={sharedStyles.smallCard}>
        <ErrorText subject="the total expenditures by this committee" />
      </div>
    );
  }
  if (isError(totalData)) {
    totalData = 0;
  }

  return (
    <MoneyCard
      amount={formatCurrency(totalData as number, true)}
      topText="They have spent"
      bottomText="of it so far."
    />
  );
}
