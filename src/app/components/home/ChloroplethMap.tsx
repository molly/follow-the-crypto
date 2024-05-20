"use client";

import { STATES_BY_FULL } from "@/app/data/states";
import { db } from "@/app/db";
import { Expenditures } from "@/app/types/Expenditures";
import * as d3 from "d3";
import { doc, getDoc } from "firebase/firestore";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useEffect, useMemo, useRef, useState } from "react";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import ChloroplethTooltip from "./ChloroplethTooltip";
import Legend from "./Legend";
import styles from "./chloroplethMap.module.css";

interface HoveredState {
  state?: string;
  expenditures?: Expenditures;
  centroid?: [number, number];
  svgSize?: DOMRect;
}

const DOMAIN = [10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7, 10 ** 8];
const LIGHT_THEME = ["#eff4ff", "#dbe6fe", "#93b4fd", "#2563eb", "#1e4baf"];
const DARK_THEME = ["#172a54", "#1e408a", "#1e4baf", "#2563eb", "#6090fa"];

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
  const [hoveredState, setHoveredState] = useState<HoveredState | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

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

  const isDarkMode = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    [],
  );

  const collection: FeatureCollection<Geometry, GeoJsonProperties> =
    topojson.feature(us, us.objects.states) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
  const data = collection.features;

  const colorScale = d3
    .scaleThreshold<number, string>()
    .domain(DOMAIN)
    .range(isDarkMode ? DARK_THEME : LIGHT_THEME);

  const path = d3.geoPath();

  return (
    <div className={styles.mapWrapper}>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Something went wrong loading state donation data.</div>}
      {!isLoading && !isError && expendituresByState && (
        <>
          <svg ref={svgRef} className={styles.svg} viewBox="0 0 1000 620">
            <Legend
              colors={isDarkMode ? DARK_THEME : LIGHT_THEME}
              domain={DOMAIN}
            />
            <g>
              {data.map((d) => {
                const setTooltipData = () => {
                  setHoveredState({
                    state: d.properties?.name,
                    expenditures: getExpenditure(
                      d.properties?.name,
                      expendituresByState,
                    ),
                    centroid: path.centroid(d.geometry),
                    svgSize: svgRef.current?.getBoundingClientRect(),
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
