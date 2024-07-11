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
  const totalData = await fetchCommitteeTotalExpenditures(committeeId);
  if (isError(totalData)) {
    return (
      <div className={sharedStyles.smallCard}>
        {is4xx(totalData) ? (
          <span className="secondary">Committee not found.</span>
        ) : (
          <ErrorText subject="the total expenditures by this committee" />
        )}
      </div>
    );
  }

  return (
    <MoneyCard
      amount={formatCurrency(totalData as number, true)}
      topText="They have spent"
      bottomText="of it so far."
    />
  );
}
