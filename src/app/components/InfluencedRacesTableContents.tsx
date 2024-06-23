import {
  fetchAllStateElections,
  fetchCandidateExpenditures,
} from "@/app/actions/fetch";
import styles from "@/app/components/tables.module.css";
import { ElectionsByState } from "@/app/types/Elections";
import { ExpendituresByCandidate } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import Candidate from "./Candidate";
import ErrorText from "./ErrorText";
import Outcome from "./Outcome";

export const revalidate = 0;

export default async function InfluencedRacesTableContents() {
  const [expenditureData, raceData] = await Promise.all([
    fetchCandidateExpenditures(),
    fetchAllStateElections(),
  ]);
  if (isError(expenditureData) || isError(raceData)) {
    return (
      <tr className={styles.influencedErrorRow}>
        <td colSpan={6}>
          <ErrorText
            subject="the list of races influenced by
          crypto industry money"
          />
        </td>
      </tr>
    );
  }

  const { order, candidates } = expenditureData as ExpendituresByCandidate;
  const raceDetails = raceData as Record<string, ElectionsByState>;

  return order.map((candidateName) => {
    const candidate = candidates[candidateName];
    const race = raceDetails[candidate.state][candidate.race];
    const raceHref = `/races/${candidate.state}-${candidate.race}`;
    return (
      <tr className={styles.influencedTableRow} key={candidate.common_name}>
        <td>
          <Link className="unstyled" href={raceHref}>
            <Candidate candidateSummary={candidate} />
          </Link>
        </td>
        <td className="center-cell">
          <Link className="unstyled" href={`/states/${candidate.state}`}>
            {candidate.state}
          </Link>
        </td>
        <td className="center-cell">
          <Link className="unstyled" href={raceHref}>
            {getRaceName(`${candidate.state}-${candidate.race}`)}
          </Link>
        </td>
        <td className="number-cell">
          {candidate.support_total
            ? formatCurrency(candidate.support_total, true)
            : ""}
        </td>
        <td className="number-cell">
          {candidate.oppose_total
            ? formatCurrency(candidate.oppose_total, true)
            : ""}
        </td>
        <td>
          <Outcome candidate={candidate} races={race.races} withIcon={true} />
        </td>
      </tr>
    );
  });
}
