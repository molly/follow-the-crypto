"use client";

import { STATES_BY_FULL } from "@/app/data/states";
import { MapData, StateTotals } from "@/app/types/MapData";
import { ErrorType, isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";
import * as d3 from "d3";
import { motion } from "framer-motion";
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";
import { MouseEvent, createRef, useCallback, useRef, useState } from "react";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import ErrorText from "../ErrorText";
import ChloroplethTooltip from "./ChloroplethTooltip";
import Legend from "./Legend";
import { DOMAIN, FILL_CLASS_NAMES } from "./chloroplethConstants";
import styles from "./chloroplethMap.module.css";

interface HoveredState {
  state?: string;
  expenditures?: StateTotals;
}

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
  const [hoveredState, setHoveredState] = useState<HoveredState | null>(null);
  const [isOpen, setIsOpen] = useState(false);
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

  const stateRefs = useRef(
    data.reduce(
      (acc, d) => {
        acc[d.id as string] = createRef();
        return acc;
      },
      {} as Record<string, React.RefObject<SVGCircleElement>>,
    ),
  );

  const { refs, floatingStyles, context } = useFloating({
    open: Boolean(
      hoveredState && hoveredState.state && hoveredState.expenditures && isOpen,
    ),
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const setTooltipData = useCallback(
    (d: Feature<Geometry, GeoJsonProperties>) => {
      if (
        isError(mapData) ||
        !d.properties?.name ||
        (hoveredState && hoveredState.state === d.properties.name)
      ) {
        return;
      }
      const expenditures = getExpenditure(d.properties?.name, mapData);
      if (expenditures) {
        refs.setReference(stateRefs.current[d.id as string].current);
        setHoveredState({
          state: d.properties?.name,
          expenditures: getExpenditure(d.properties?.name, mapData),
        });
      } else {
        setHoveredState(null);
        setIsOpen(false);
      }
    },
    [hoveredState, mapData, refs],
  );

  const closeTooltip = useCallback((e?: MouseEvent) => {
    if (
      e &&
      e.relatedTarget &&
      "className" in e.relatedTarget &&
      typeof e.relatedTarget.className === "string" &&
      e.relatedTarget.className.includes("chloroplethMap_tooltip")
    ) {
      return;
    }
    setHoveredState(null);
    setIsOpen(false);
  }, []);

  return (
    <div className={styles.mapWrapper}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox="0 0 1000 620"
        role="group"
        aria-label="Map of the US showing cryptocurrency-related spending by state"
      >
        <Legend fillClassNames={FILL_CLASS_NAMES} domain={DOMAIN} />
        {data.map((d) => {
          const centroid = path.centroid(d);
          const stateFullName = d.properties?.name;
          const expenditures = getExpenditure(stateFullName, mapData);
          return (
            <g
              key={d.id}
              onMouseEnter={() => setTooltipData(d)}
              onClick={() => setTooltipData(d)}
              onFocus={() => setTooltipData(d)}
              onBlur={() => closeTooltip()}
              onMouseLeave={(e) => closeTooltip(e)}
              aria-haspopup={true}
              tabIndex={0}
              aria-label={`${expenditures ? formatCurrency(expenditures.total, true) : "$0"} spent in ${stateFullName}`}
              aria-describedby={`tooltip-${stateFullName}`}
            >
              <motion.path
                id={d.id as string}
                key={`state-${d.id}`}
                d={path(d) as string}
                className={getFill(d.properties?.name, mapData, colorScale)}
                initial={{
                  fillOpacity: 0.0,
                  strokeOpacity: 0.2,
                }}
                animate={{ fillOpacity: 1, strokeOpacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <circle
                key={`state-centroid-${d.id}`}
                ref={stateRefs.current[d.id as string]}
                r="0"
                cx={centroid[0]}
                cy={centroid[1]}
              />
            </g>
          );
        })}
      </svg>
      {isError(mapData) && (
        <div className={styles.mapLoadingError}>
          <ErrorText subject="expenditures by state" />
        </div>
      )}
      <ChloroplethTooltip
        id={hoveredState?.state ? `tooltip-${hoveredState.state}` : undefined}
        setHoveredState={setHoveredState}
        ref={refs.setFloating}
        style={floatingStyles}
        context={context}
        tabIndex={0}
        {...hoveredState}
      />
    </div>
  );
}
