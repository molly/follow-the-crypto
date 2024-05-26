import { fetchStateExpenditures } from "@/app/actions/fetch";
import TotalSpending from "@/app/components/TotalSpending";
import { STATES_BY_FULL } from "@/app/data/states";
import sharedStyles from "@/app/shared.module.css";
import { Expenditures } from "@/app/types/Expenditures";
import { is4xx, isError } from "@/app/utils/errors";
import { titlecase } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ByCommittee from "./ByCommittee";
import ByRace from "./ByRace";

export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  return {
    title: `${titlecase(params.state.split("-").join(" "))} | Follow the Crypto`,
  };
}

export default async function CommitteePage({
  params,
}: {
  params: { state: string };
}) {
  const titlecasedState = titlecase(params.state.split("-").join(" "));
  if (!(titlecasedState in STATES_BY_FULL)) {
    notFound();
  }

  const stateAbbr = STATES_BY_FULL[titlecasedState];
  let data = await fetchStateExpenditures(stateAbbr);

  if (isError(data)) {
    if (is4xx(data)) {
      return (
        <div className={sharedStyles.smallCard}>
          No spending has been recorded in this state.
        </div>
      );
    }
    return <div>Something went wrong when getting expenditure data.</div>;
  }

  const expenditures = data as Expenditures;

  return (
    <>
      <h1 className={sharedStyles.titleH2}>{titlecasedState}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TotalSpending
          amount={formatCurrency(expenditures.total, true)}
          influenceSubject={`2024 elections in ${titlecasedState}`}
        />
      </Suspense>
      <Suspense>
        <ByCommittee expenditures={expenditures} />
      </Suspense>
      <Suspense>
        <ByRace expenditures={expenditures} stateAbbr={stateAbbr} />
      </Suspense>
    </>
  );
}