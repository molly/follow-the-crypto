import { fetchMapData } from "@/app/actions/fetch";
import { STATES_BY_ABBR } from "@/app/data/states";
import { MapData } from "@/app/types/MapData";
import { isError } from "@/app/utils/errors";
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

export default async function SuperPacSpendingMapWrapper() {
  const data = await fetchMapData();
  if (isError(data)) {
    return (
      <div>
        <h2>Expenditures by pro-crypto super PACs by state</h2>
        <ErrorText subject="PAC expenditures by state" />
      </div>
    );
  }
  const mapData = data as MapData;
  return (
    <>
      <h2>Expenditures by pro-crypto super PACs by state</h2>
      <ChloroplethMap
        domain={generateDomain(10000, 10000000)}
        stateValues={toStateValues(mapData)}
        ariaLabel="Map of the US showing spending by pro-crypto super PACs by state"
      />
      <Link href="/states">&raquo; Spending by state</Link>
    </>
  );
}
