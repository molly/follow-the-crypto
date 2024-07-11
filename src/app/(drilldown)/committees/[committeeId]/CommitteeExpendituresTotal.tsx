import { fetchCommitteeTotalExpenditures } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard from "@/app/components/MoneyCard";
import { isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";

export default async function CommitteeExpendituresTotal({
  committeeId,
}: {
  committeeId: string;
}) {
  const totalData = await fetchCommitteeTotalExpenditures(committeeId);
  if (isError(totalData)) {
    return <ErrorText subject="the total expenditures by this committee" />;
  }

  return (
    <MoneyCard
      amount={formatCurrency(totalData as number, true)}
      topText="They have spent"
      bottomText="of it so far."
    />
  );
}
