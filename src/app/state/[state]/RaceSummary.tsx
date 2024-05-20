import { db } from "@/app/db";
import { ElectionGroup } from "@/app/types/Elections";
import { ErrorType } from "@/app/types/Error";
import { RaceExpenditureGroup } from "@/app/types/Expenditures";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import { currency } from "@/app/utils/utils";
import { doc, getDoc } from "firebase/firestore";
import styles from "./page.module.css";

async function getElectionData(
  raceId: string,
): Promise<ElectionGroup | ErrorType> {
  try {
    const raceParts = raceId.split("-");
    const docRef = doc(db, "elections", "state");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      if (raceParts[0] in data) {
        return data[raceParts[0]][
          raceParts.slice(1).join("-")
        ] as ElectionGroup;
      }
    }
  } catch (e) {
    return { error: true };
  }
  return { error: true };
}

export default async function RaceSummary({
  raceId,
  race,
}: {
  raceId: string;
  race: RaceExpenditureGroup;
}) {
  const result = await getElectionData(raceId);
  if ("error" in result) {
    return <div>Could not find election data for this race</div>;
  }

  const electionData = result as ElectionGroup;
  return (
    <div>
      {electionData.candidates.map((candidate) => {
        if (!candidate.candidate_name) {
          return null;
        }
        let [lastName, firstName] = candidate.candidate_name.split(", ");
        firstName = firstName.split(" ")[0];
        const expenditures = race.expenditures.filter(
          (exp) =>
            exp.candidate_last_name === lastName &&
            exp.candidate_first_name?.includes(firstName),
        );
        const supportTotal = expenditures.reduce((acc, exp) => {
          if (exp.support_oppose_indicator === "S") {
            return acc + exp.expenditure_amount;
          }
          return acc;
        }, 0);
        const opposeTotal = expenditures.reduce((acc, exp) => {
          if (exp.support_oppose_indicator === "O") {
            return acc + exp.expenditure_amount;
          }
          return acc;
        }, 0);

        return (
          <div key={candidate.candidate_id}>
            <span>{titlecaseLastFirst(candidate.candidate_name)}</span>
            {candidate.party_full && <span> ({candidate.party_full[0]})</span>}
            {expenditures.length > 0 && (
              <div className={styles.cardSubsection}>
                {supportTotal > 0 && (
                  <div>
                    {currency(supportTotal, true)} to <b>support</b>
                  </div>
                )}
                {opposeTotal > 0 && (
                  <div>
                    {currency(opposeTotal, true)} to <b>oppose</b>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
