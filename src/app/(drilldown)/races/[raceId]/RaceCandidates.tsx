import Candidate from "@/app/components/Candidate";
import { CandidateSummary, RaceType } from "@/app/types/Elections";
import { humanizeList } from "@/app/utils/humanize";
import styles from "./page.module.css";

export default function RaceCandidates({
  raceType,
  candidates,
  hasSpendingInOtherRaces,
}: {
  raceType: RaceType;
  candidates: CandidateSummary[];
  hasSpendingInOtherRaces: CandidateSummary[];
}) {
  return (
    <table className={styles.candidateExpendituresTable}>
      <thead>
        <tr>
          <th className={styles.candidateCell}></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate, ind) => {
          const defeated =
            candidate.defeated && candidate.defeated_race === raceType;
          return (
            <tr key={candidate.common_name}>
              <td
                className={`${styles.candidateCell} ${ind < candidates.length - 1 ? styles.candidateRow : ""}`}
              >
                <Candidate
                  candidate={candidate}
                  candidateNameClassName={
                    defeated
                      ? styles.defeatedCandidateName
                      : styles.activeCandidateName
                  }
                />
              </td>
              {ind === 0 && (
                <td
                  className={styles.noSpendingCell}
                  rowSpan={candidates.length}
                >
                  <span>
                    No cryptocurrency-focused groups have made expenditures
                    pertaining to this specific race
                  </span>
                  {hasSpendingInOtherRaces.length > 0 && (
                    <>
                      <span> although they have supported </span>
                      {humanizeList(
                        hasSpendingInOtherRaces.map((c) => (
                          <span key={c.common_name} className="bold">
                            {c.common_name}
                          </span>
                        )),
                      )}
                      <span> in other races for this seat</span>
                    </>
                  )}
                  <span>.</span>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
