import { ElectionGroup } from "@/app/types/Elections";
import { RaceExpenditureGroup } from "@/app/types/Expenditures";
import { titlecaseLastFirst } from "@/app/utils/titlecase";
import { currency } from "@/app/utils/utils";
import styles from "./page.module.css";

export default function RaceSummary({
  raceId,
  race,
  electionData,
}: {
  raceId: string;
  race: RaceExpenditureGroup;
  electionData: ElectionGroup;
}) {
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
