import { STATES_BY_FULL } from "@/app/data/states";
import { db } from "@/app/db";
import { Expenditures } from "@/app/types/Expenditures";
import * as d3 from "d3";
import { doc, getDoc } from "firebase/firestore";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import styles from "./chloroplethMap.module.css";

async function getExpendituresByState(): Promise<
  Record<string, Expenditures> | { error: boolean; statusCode?: number }
> {
  try {
    const docRef = doc(db, "expenditures", "states");
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as Record<string, Expenditures>;
    } else {
      return { error: true, statusCode: 404 };
    }
  } catch (e) {
    return { error: true };
  }
}

function getFill(
  stateFullName: string,
  expendituresByState: Record<string, Expenditures>,
  colorScale: d3.ScaleThreshold<number, string>,
): string | undefined {
  if (!stateFullName) {
    return undefined;
  }

  const stateAbbr = STATES_BY_FULL[stateFullName];
  if (stateAbbr && stateAbbr in expendituresByState) {
    return colorScale(expendituresByState[stateAbbr].total);
  }
  return undefined;
}

export default async function ChloroplethMap() {
  const us: Topology<
    Objects<GeoJsonProperties>
  > = require("@/app/data/counties-albers-10m.json"); // Specify the type of us

  const expendituresByState = await getExpendituresByState();
  if ("error" in expendituresByState) {
    return <div>Error loading state donation data.</div>;
  }

  const collection: FeatureCollection<Geometry, GeoJsonProperties> =
    topojson.feature(us, us.objects.states) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
  const data = collection.features;

  const colorScale = d3
    .scaleThreshold<number, string>()
    .domain([10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7, 10 ** 8])
    .range(d3.schemeBlues[6]);
  const path = d3.geoPath();

  return (
    <div className="bubble-map">
      <svg className={styles.svg} viewBox="0 0 960 600">
        <g>
          {data.map((d) => (
            <path
              key={d.id}
              d={path(d) as string}
              fill={getFill(
                d.properties?.name,
                expendituresByState,
                colorScale,
              )}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
