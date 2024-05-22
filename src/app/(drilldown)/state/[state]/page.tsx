import TotalSpending from "@/app/components/TotalSpending";
import { STATES_BY_FULL } from "@/app/data/states";
import { db } from "@/app/db";
import sharedStyles from "@/app/shared.module.css";
import { Expenditures } from "@/app/types/Expenditures";
import { titlecase } from "@/app/utils/titlecase";
import { currency } from "@/app/utils/utils";
import { doc, getDoc } from "firebase/firestore";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

async function getStateExpenditures(
  state: string,
): Promise<Expenditures | { error: boolean; statusCode?: number }> {
  try {
    const abbr = STATES_BY_FULL[state];
    const docRef = doc(db, "expenditures", "states");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      if (snapshot.data().hasOwnProperty(abbr)) {
        return snapshot.data()[abbr] as Expenditures;
      } else {
        return { error: true, statusCode: 404 };
      }
    } else {
      return { error: true };
    }
  } catch (e) {
    return { error: true };
  }
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

  let expenditures = await getStateExpenditures(titlecasedState);

  const renderError = () => {
    if ("statusCode" in expenditures && expenditures.statusCode === 404) {
      return (
        <div className={sharedStyles.smallCard}>
          No spending has been recorded in this state.
        </div>
      );
    } else {
      return <div>Something went wrong when getting expenditure data.</div>;
    }
  };

  const renderBody = async () => {
    expenditures = expenditures as Expenditures;
    return (
      <>
        <TotalSpending
          amount={currency(expenditures.total, true)}
          influenceSubject={`2024 elections in ${titlecasedState}`}
        />
        <ByCommittee expenditures={expenditures} />
        <ByRace expenditures={expenditures} />
      </>
    );
  };

  return (
    <>
      <h1 className={sharedStyles.titleH2}>{titlecasedState}</h1>
      {"error" in expenditures ? renderError() : renderBody()}
    </>
  );
}
