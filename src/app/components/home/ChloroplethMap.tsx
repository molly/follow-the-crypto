"use client";

import { STATES_BY_FULL } from "@/app/data/states";
import { db } from "@/app/db";
import { Expenditures } from "@/app/types/Expenditures";
import * as d3 from "d3";
import { doc, getDoc } from "firebase/firestore";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useEffect, useState } from "react";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import ChloroplethTooltip from "./ChloroplethTooltip";
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

function getExpenditure(
  stateFullName: string,
  expendituresByState: Record<string, Expenditures>,
): Expenditures | undefined {
  if (stateFullName) {
    const stateAbbr = STATES_BY_FULL[stateFullName];
    if (stateAbbr && stateAbbr in expendituresByState) {
      return expendituresByState[stateAbbr];
    }
  }
  return undefined;
}

function getFill(
  stateFullName: string,
  expendituresByState: Record<string, Expenditures>,
  colorScale: d3.ScaleThreshold<number, string>,
): string | undefined {
  const expenditures = getExpenditure(stateFullName, expendituresByState);
  if (expenditures) {
    return colorScale(expenditures.total);
  }
  return undefined;
}

export default function ChloroplethMap() {
  const [expendituresByState, setExpendituresByState] = useState<Record<
    string,
    Expenditures
  > | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [hoveredState, setHoveredState] = useState(null);

  const us: Topology<
    Objects<GeoJsonProperties>
  > = require("@/app/data/counties-albers-10m.json");

  useEffect(() => {
    (async function () {
      const expendituresData = await getExpendituresByState();
      setIsLoading(false);
      if ("error" in expendituresData) {
        setIsError(true);
        return;
      } else {
        setExpendituresByState(
          expendituresData as Record<string, Expenditures>,
        );
      }
    })();
  }, [setIsLoading, setIsError, setExpendituresByState]);

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
    <div className={styles.mapWrapper}>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong loading state donation data.</div>}
      {!isLoading && !isError && expendituresByState && (
        <>
          <svg className={styles.svg} viewBox="0 0 960 600">
            <g>
              {data.map((d) => {
                const setTooltipData = () => {
                  console.log(expendituresByState);
                  setHoveredState({
                    state: d.properties?.name,
                    expenditures: getExpenditure(
                      d.properties?.name,
                      expendituresByState,
                    ),
                    centroid: path.centroid(d.geometry),
                  });
                };

                return (
                  <path
                    key={d.id}
                    d={path(d) as string}
                    fill={getFill(
                      d.properties?.name,
                      expendituresByState,
                      colorScale,
                    )}
                    onMouseEnter={setTooltipData}
                    onClick={setTooltipData}
                  />
                );
              })}
            </g>
          </svg>
          <ChloroplethTooltip {...hoveredState} />
        </>
      )}
    </div>
  );
}
