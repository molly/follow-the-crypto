"use client";

import { STATES_BY_FULL } from "@/app/data/states";
import { Expenditures } from "@/app/types/Expenditures";
import { ErrorType, isError } from "@/app/utils/errors";
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
import { createRef, useCallback, useRef, useState } from "react";
import * as topojson from "topojson-client";
import { Objects, Topology } from "topojson-specification";
import ErrorText from "../ErrorText";
import ChloroplethTooltip from "./ChloroplethTooltip";
import Legend from "./Legend";
import { DOMAIN, FILL_CLASS_NAMES } from "./chloroplethConstants";
import styles from "./chloroplethMap.module.css";

interface HoveredState {
  state?: string;
  expenditures?: Expenditures;
}

function getExpenditure(
  stateFullName: string,
  expendituresByState: Record<string, Expenditures> | ErrorType,
): Expenditures | undefined {
  if (!isError(expendituresByState) && stateFullName) {
    const stateAbbr = STATES_BY_FULL[stateFullName];
    if (stateAbbr && stateAbbr in expendituresByState) {
      return (expendituresByState as Record<string, Expenditures>)[stateAbbr];
    }
  }
  return undefined;
}

function getFill(
  stateFullName: string,
  expendituresByState: Record<string, Expenditures> | ErrorType,
  colorScale: d3.ScaleThreshold<number, string>,
): string | undefined {
  if (isError(expendituresByState)) {
    return styles.stateFillError;
  }
  const expenditures = getExpenditure(stateFullName, expendituresByState);
  if (expenditures) {
    return styles[colorScale(expenditures.total)];
  }
  return styles.stateFill0;
}

export default function ChloroplethMap({
  expendituresByState,
}: {
  expendituresByState: Record<string, Expenditures> | ErrorType;
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
        isError(expendituresByState) ||
        !d.properties?.name ||
        (hoveredState && hoveredState.state === d.properties.name)
      ) {
        return;
      }
      const expenditures = getExpenditure(
        d.properties?.name,
        expendituresByState as Record<string, Expenditures>,
      );
      if (expenditures) {
        refs.setReference(stateRefs.current[d.id as string].current);
        setHoveredState({
          state: d.properties?.name,
          expenditures: getExpenditure(
            d.properties?.name,
            expendituresByState as Record<string, Expenditures>,
          ),
        });
      } else {
        setHoveredState(null);
        setIsOpen(false);
      }
    },
    [hoveredState, expendituresByState, refs],
  );

  const closeTooltip = useCallback((e: MouseEvent) => {
    if (
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
      <svg ref={svgRef} className={styles.svg} viewBox="0 0 1000 620">
        <Legend fillClassNames={FILL_CLASS_NAMES} domain={DOMAIN} />
        {data.map((d) => {
          const centroid = path.centroid(d);
          return (
            <g
              key={d.id}
              onMouseEnter={() => setTooltipData(d)}
              onClick={() => setTooltipData(d)}
              onMouseLeave={(e) => closeTooltip}
            >
              <motion.path
                id={d.id as string}
                key={`state-${d.id}`}
                d={path(d) as string}
                className={getFill(
                  d.properties?.name,
                  expendituresByState,
                  colorScale,
                )}
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
      {isError(expendituresByState) && (
        <div className={styles.mapLoadingError}>
          <ErrorText subject="expenditures by state" />
        </div>
      )}
      <ChloroplethTooltip
        setHoveredState={setHoveredState}
        ref={refs.setFloating}
        style={floatingStyles}
        context={context}
        {...hoveredState}
      />
    </div>
  );
}
