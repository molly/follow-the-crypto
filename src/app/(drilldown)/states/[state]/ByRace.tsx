import { fetchStateElections } from "@/app/actions/fetch";
import { ElectionGroup } from "@/app/types/Elections";
import { Expenditures } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { sortRaces } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import RaceSummary from "./RaceSummary";
import styles from "./page.module.css";

const getRaceName = (raceId: string) => {
  const raceParts = raceId.split("-");
  if (raceParts[1] === "S") {
    return "Senate";
  } else if (raceParts[1] === "H") {
    return `House District ${parseInt(raceParts[2], 10)}`;
  }
};

export default async function ByRace({
  expenditures,
  stateAbbr,
}: {
  expenditures: Expenditures;
  stateAbbr: string;
}) {
  const data = await fetchStateElections(stateAbbr);
  const races = Object.keys(expenditures.by_race).sort(sortRaces);

  const renderRaces = () => {
    const electionData = data as Record<string, ElectionGroup>;
    return races.map(async (raceId) => {
      const shortId = raceId.split("-").slice(1).join("-");
      return (
        <div key={raceId} className={styles.cardSection}>
          <Link href={`/race/${raceId}`}>
            <h3>{getRaceName(raceId)}</h3>
          </Link>
          <b>{formatCurrency(expenditures.by_race[raceId].total, true)}</b>
          {isError(data) ? (
            <div>Something went wrong fetching election data.</div>
          ) : (
            <RaceSummary
              raceId={raceId}
              race={expenditures.by_race[raceId]}
              electionData={electionData[shortId]}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div className={styles.raceCard}>
      <h2>By race</h2>
      {isError(data) ? <div></div> : renderRaces()}
    </div>
  );
}
