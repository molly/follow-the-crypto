import { fetchCandidatesWithOpposeSpending } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import { STATES_BY_ABBR } from "@/app/data/states";
import { ExpenditureCandidateSummary } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { getFullPartyName } from "@/app/utils/party";
import { getRaceName } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";

function Party({ party }: { party?: string }) {
  if (!party) {
    return <span className="secondary">Pending</span>;
  } else if (party === "MIX") {
    return "Multiple parties";
  }
  return getFullPartyName(party[0], false);
}

export default async function OppositionSpending() {
  const data = await fetchCandidatesWithOpposeSpending();
  if (isError(data)) {
    return <ErrorText subject="opposition spending" />;
  }
  const candidates = data as ExpenditureCandidateSummary[];
  return (
    <table>
      <thead>
        <tr>
          <th className="number-cell">Oppose spending</th>
          <th className="text-cell">Targeted candidate</th>
          <th className="text-cell">Election</th>
          <th className="text-cell">Likely intended beneficiary</th>
          <th className="text-cell">Beneficiary party</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate) => {
          const race = `${candidate.state}-${candidate.race}`;
          return (
            <tr key={candidate.candidate_id}>
              <td className="number-cell">
                {formatCurrency(candidate.oppose_total, true)}
              </td>
              <td className="text-cell">{candidate.common_name}</td>
              <td className="text-cell">
                <Link href={`/elections/${race}`}>
                  {`${STATES_BY_ABBR[candidate.state]} ${getRaceName(race)}`}
                </Link>
              </td>
              <td className="text-cell">
                {candidate.opposition_details ? (
                  candidate.opposition_details.benefitsCandidate
                ) : (
                  <span className="secondary">Pending</span>
                )}
              </td>
              <td className="text-cell">
                <Party party={candidate.opposition_details?.benefitsParty} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
