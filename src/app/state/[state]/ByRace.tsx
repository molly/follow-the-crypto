import { Expenditures } from "@/app/types/Expenditures";
import { sortRaces } from "@/app/utils/races";
import { currency } from "@/app/utils/utils";
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

export default function ByRace({
  expenditures,
}: {
  expenditures: Expenditures;
}) {
  const races = Object.keys(expenditures.by_race).sort(sortRaces);

  return (
    <div className={styles.raceCard}>
      <h2>By race</h2>
      {races.map(async (raceId) => {
        return (
          <div key={raceId} className={styles.cardSection}>
            <Link href={`/race/${raceId}`}>
              <h3>{getRaceName(raceId)}</h3>
            </Link>
            <b>{currency(expenditures.by_race[raceId].total, true)}</b>
            <RaceSummary raceId={raceId} race={expenditures.by_race[raceId]} />
          </div>
        );
      })}
    </div>
  );
}
