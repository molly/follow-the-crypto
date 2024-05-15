"use client";

import us from "@/app/data/counties-albers-10m.json";
import { STATES_BY_FULL } from "@/app/data/states";
import { db } from "@/app/db";
import { Expenditures } from "@/app/types/Expenditures";
import * as d3 from "d3";
import { doc, getDoc } from "firebase/firestore";
import { RefObject, useEffect, useRef } from "react";
import * as topojson from "topojson-client";
import styles from "./chloroplethMap.module.css";

async function getExpendituresByState() {
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

async function drawMap(svgRef: RefObject<SVGSVGElement>) {
  // TODO: Error handling
  const expenditures = await getExpendituresByState();
  const data = topojson.feature(us, us.objects.states).features;
  const colorScale = d3
    .scaleThreshold()
    .domain([10 ** 4, 10 ** 5, 10 ** 6, 10 ** 7, 10 ** 8])
    .range(d3.schemeBlues[6]);

  const svg = d3.select(svgRef.current);
  const path = d3.geoPath();
  svg
    .append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", (d) => {
      const stateAbbr = STATES_BY_FULL[d.properties.name];
      if (stateAbbr in expenditures) {
        return colorScale(expenditures[stateAbbr].total);
      } else {
        return null;
      }
    });
}

export default function ChloroplethMap() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    drawMap(svgRef);
  }, [svgRef]);

  return (
    <div className="bubble-map">
      <svg className={styles.svg} ref={svgRef} viewBox="0 0 960 600" />
    </div>
  );
}
