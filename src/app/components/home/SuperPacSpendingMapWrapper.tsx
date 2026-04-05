import { fetchMapData } from "@/app/actions/fetch";
import { STATES_BY_ABBR } from "@/app/data/states";
import { MapData } from "@/app/types/MapData";
import { isError } from "@/app/utils/errors";
import { type Sector } from "@/app/types/Sector";
import { humanizeSector } from "@/app/utils/sector";
import Link from "next/link";
import ChloroplethMap from "../ChloroplethMap";
import ErrorText from "../ErrorText";
import { generateDomain } from "../chloroplethConstants";

function toStateValues(mapData: MapData): Record<string, number> {
  const values: Record<string, number> = {};
  for (const [abbr, totals] of Object.entries(mapData)) {
    const fullName = STATES_BY_ABBR[abbr];
    if (fullName && totals.total) {
      values[fullName] = totals.total;
    }
  }
  return values;
}

export default async function SuperPacSpendingMapWrapper({
  sector,
  showLink,
}: {
  sector: Sector;
  showLink?: boolean;
}) {
  const data = await fetchMapData();
  const sectorText = humanizeSector(sector, {
    context: "industry",
    abbrev: true,
    lowercase: true,
  });
  if (isError(data)) {
    return (
      <div>
        <h2>Expenditures by {sectorText} PACs by state</h2>
        <ErrorText subject="PAC expenditures by state" />
      </div>
    );
  }
  const mapData = data as MapData;
  return (
    <>
      <h2 id="super-pac-spending-by-state">
        Expenditures by {sectorText} PACs by state
      </h2>
      <ChloroplethMap
        domain={generateDomain(10000, 10000000)}
        stateValues={toStateValues(mapData)}
        labelId="super-pac-spending-by-state"
      />
      {showLink && <Link href="/2026/states">&raquo; Spending by state</Link>}
    </>
  );
}
