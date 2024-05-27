"use client";

import { STATES_BY_FULL } from "@/app/data/states";
import { Expenditures } from "@/app/types/Expenditures";
import * as d3 from "d3";
import { AnimatePresence, motion } from "framer-motion";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { useRef, useState } from "react";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import ChloroplethTooltip from "./ChloroplethTooltip";
import Legend from "./Legend";
import { DOMAIN, FILL_CLASS_NAMES } from "./chloroplethConstants";
import styles from "./chloroplethMap.module.css";

interface HoveredState {
  state?: string;
  expenditures?: Expenditures;
  centroid?: [number, number];
  svgSize?: DOMRect;
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
    return styles[colorScale(expenditures.total)];
  }
  return styles.stateFill0;
}

export default function ChloroplethMap({
  expendituresByState,
}: {
  expendituresByState: Record<string, Expenditures>;
}) {
  const [hoveredState, setHoveredState] = useState<HoveredState | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

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
    <AnimatePresence>
      <div className={styles.mapWrapper}>
        <svg ref={svgRef} className={styles.svg} viewBox="0 0 1000 620">
          <Legend fillClassNames={FILL_CLASS_NAMES} domain={DOMAIN} />
          <g>
            {data.map((d) => {
              const fill = getFill(
                d.properties?.name,
                expendituresByState,
                colorScale,
              );
              function setTooltipData() {
                setHoveredState({
                  state: d.properties?.name,
                  expenditures: getExpenditure(
                    d.properties?.name,
                    expendituresByState as Record<string, Expenditures>,
                  ),
                  centroid: path.centroid(d.geometry),
                  svgSize: svgRef.current?.getBoundingClientRect(),
                });
              }

              return (
                <motion.path
                  id={d.id as string}
                  key={`state-${d.id}`}
                  d={path(d) as string}
                  className={getFill(
                    d.properties?.name,
                    expendituresByState,
                    colorScale,
                  )}
                  onMouseEnter={setTooltipData}
                  onClick={setTooltipData}
                  initial={{
                    fillOpacity: 0.0,
                    strokeOpacity: 0.2,
                  }}
                  animate={{ fillOpacity: 1, strokeOpacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              );
            })}
          </g>
        </svg>
        <ChloroplethTooltip {...hoveredState} />
      </div>
    </AnimatePresence>
  );
}
