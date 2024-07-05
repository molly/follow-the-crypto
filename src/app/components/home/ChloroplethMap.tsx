"use client";

import { STATES_BY_FULL } from "@/app/data/states";
import { MapData, StateTotals } from "@/app/types/MapData";
import { ErrorType, isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";
import * as d3 from "d3";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import Link from "next/link";
import { useMemo, useState } from "react";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import ErrorText from "../ErrorText";
import Legend from "./Legend";
import { DOMAIN, FILL_CLASS_NAMES } from "./chloroplethConstants";
import styles from "./chloroplethMap.module.css";

function getExpenditure(
  stateFullName: string,
  mapData: MapData | ErrorType,
): StateTotals | undefined {
  if (!isError(mapData) && stateFullName) {
    const stateAbbr = STATES_BY_FULL[stateFullName];
    if (stateAbbr && stateAbbr in mapData) {
      return (mapData as MapData)[stateAbbr];
    }
  }
  return undefined;
}

function getFill(
  stateFullName: string,
  mapData: MapData | ErrorType,
  colorScale: d3.ScaleThreshold<number, string>,
): string | undefined {
  if (isError(mapData)) {
    return styles.stateFillError;
  }
  const expenditures = getExpenditure(stateFullName, mapData);
  if (expenditures) {
    return styles[colorScale(expenditures.total)];
  }
  return styles.stateFill0;
}

export default function ChloroplethMap({
  mapData,
}: {
  mapData: MapData | ErrorType;
}) {
  const [activeState, setActiveState] = useState<string | null>(null);
  const activeStateExpenditures = useMemo(() => {
    return activeState ? getExpenditure(activeState, mapData) : null;
  }, [activeState, mapData]);
  const us: Topology<
    Objects<GeoJsonProperties>
  > = require("@/app/data/counties-albers-10m.json");

  const collection: FeatureCollection<Geometry, GeoJsonProperties> =
    topojson.feature(us, us.objects.states) as FeatureCollection<
      Geometry,
      GeoJsonProperties
    >;
  const data = collection.features;

  const colorScale = d3
    .scaleThreshold<number, string>()
    .domain(DOMAIN)
    .range(FILL_CLASS_NAMES);

  const path = d3.geoPath();

  return (
    <div className={styles.mapWrapper}>
      <svg
        className={styles.svg}
        viewBox="0 0 1000 620"
        role="group"
        aria-label="Map of the US showing cryptocurrency-related spending by state"
      >
        <Legend fillClassNames={FILL_CLASS_NAMES} domain={DOMAIN} />
        {data.map((d) => {
          const stateFullName = d.properties?.name;
          const expenditures = getExpenditure(stateFullName, mapData);
          return (
            <Link
              href={`/states/${stateFullName.toLowerCase()}`}
              key={d.id}
              onMouseEnter={() => setActiveState(stateFullName)}
              onMouseLeave={() => setActiveState(null)}
              onFocus={() => setActiveState(stateFullName)}
              onBlur={() => setActiveState(null)}
              className={styles.stateLink}
            >
              <path
                aria-label={`${expenditures ? formatCurrency(expenditures.total, true) : "$0"} spent in ${stateFullName}`}
                d={path(d) as string}
                className={getFill(d.properties?.name, mapData, colorScale)}
              />
            </Link>
          );
        })}
        {activeState &&
          activeStateExpenditures &&
          activeStateExpenditures.total && (
            <foreignObject x={849} y={400} width={150} height={200}>
              <div className={styles.activeState}>{activeState}: </div>
              <span>{formatCurrency(activeStateExpenditures.total, true)}</span>
            </foreignObject>
          )}
      </svg>
      {isError(mapData) && (
        <div className={styles.mapLoadingError}>
          <ErrorText subject="expenditures by state" />
        </div>
      )}
    </div>
  );
}
