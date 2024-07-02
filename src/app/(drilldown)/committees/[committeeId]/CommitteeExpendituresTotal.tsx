import { fetchCommitteeTotalExpenditures } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MoneyCard, { MoneyCardSkeleton } from "@/app/components/MoneyCard";
import { isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";
import { Suspense } from "react";

async function CommitteeExpendituresTotalContent({
  committeeId,
}: {
  committeeId: string;
}) {
  const totalData = await fetchCommitteeTotalExpenditures(committeeId);
  if (isError(totalData)) {
    return <ErrorText subject="the total expenditures by this committee" />;
  }
  return formatCurrency(totalData as number, true);
}

export default function CommitteeExpendituresTotal({
  committeeId,
}: {
  committeeId: string;
}) {
  return (
    <Suspense fallback={<MoneyCardSkeleton />}>
      <MoneyCard
        amount={<CommitteeExpendituresTotalContent committeeId={committeeId} />}
        topText="They have spent"
        bottomText="of it so far."
      />
    </Suspense>
  );
}
