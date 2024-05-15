"use client";

import us from "@/app/data/counties-albers-10m.json";
import * as d3 from "d3";
import { RefObject, useEffect, useRef } from "react";
import * as topojson from "topojson-client";
import styles from "./bubblemap.module.css";

function drawMap(svgRef: RefObject<SVGSVGElement>) {
  const data = topojson.feature(us, us.objects.states).features;

  const svg = d3.select(svgRef.current);
  const path = d3.geoPath();
  svg
    .append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", path);
}

export default function BubbleMap() {
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
