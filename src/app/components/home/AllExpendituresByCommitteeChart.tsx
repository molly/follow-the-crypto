"use client";
import styles from "@/app/components/expenditures.module.css";
import { CommitteeConstant } from "@/app/types/Committee";
import { getLabelColor } from "@/app/utils/colors";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import useResizeObserver from "use-resize-observer";

const SCALE_BLUES = [
  "#1e3a8a",
  "#1e40af",
  "#1d4ed8",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

export default function SpendingByCommittee({
  expenditures,
  committeeConstants,
}: {
  expenditures: Record<string, number>;
  committeeConstants: Record<string, CommitteeConstant>;
}) {
  const { ref, width = 400, height = 200 } = useResizeObserver<SVGSVGElement>();
  const router = useRouter();

  const MARGIN_BOTTOM = 20;
  const MARGIN_TOP = 15;
  const MARGIN_LEFT = 40;
  const CHART_WIDTH = width;
  const CHART_HEIGHT = height;
  const BOUNDS_WIDTH = CHART_WIDTH - MARGIN_LEFT;
  const BOUNDS_HEIGHT = CHART_HEIGHT - MARGIN_BOTTOM - MARGIN_TOP;

  const maxExpenditure = d3.max(Object.values(expenditures)) || 0;
  const committees = Object.keys(expenditures).sort(
    (a, b) => expenditures[b] - expenditures[a],
  );
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const x = d3
    .scaleBand()
    .domain(committees)
    .range([0, BOUNDS_WIDTH])
    .paddingInner(0.1);
  const y = d3.scaleLinear().domain(yDomain).range([BOUNDS_HEIGHT, 0]);
  const xRange = x.range();
  const yRange = y.range();
  const color = d3.scaleOrdinal(committees, SCALE_BLUES);
  const gridLabelFormatter = (d: number) => d3.format("$.2s")(Math.abs(d));

  return (
    <div className={styles.svgWrapper}>
      <svg
        ref={ref}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className={styles.svg}
      >
        <g transform={`translate(0, ${MARGIN_TOP})`}>
          {y.ticks(5).map((tick) => (
            <g key={`xTick-${tick}`} transform={`translate(0,${y(tick)})`}>
              <line
                key={tick}
                x1={MARGIN_LEFT - 5}
                x2={MARGIN_LEFT}
                stroke="currentColor"
              />
              <text
                x={MARGIN_LEFT - 8}
                fontSize={12}
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {gridLabelFormatter(tick)}
              </text>
            </g>
          ))}
          <g transform={`translate(${MARGIN_LEFT}, 0)`}>
            {committees.map((committee) => {
              const spending = expenditures[committee];
              const height = y(0) - y(spending);
              return (
                <g
                  key={committee}
                  onClick={() => router.push(`/committees/${committee}`)}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={x(committee)}
                    y={y(spending)}
                    width={x.bandwidth()}
                    height={height}
                    fill={color(committee)}
                  />
                  <text
                    x={(x(committee) || 0) + x.bandwidth() / 2}
                    fontSize={14}
                    y={y(spending) - 5}
                    textAnchor="middle"
                  >
                    {gridLabelFormatter(spending)}
                  </text>
                  {height > 20 && (
                    <foreignObject
                      x={x(committee) || 0}
                      width={x.bandwidth()}
                      height={height - 5}
                      y={y(spending) + 5}
                    >
                      <div
                        className={styles.expendituresBarLabel}
                        style={{ color: getLabelColor(color(committee)) }}
                      >
                        {committee in committeeConstants
                          ? committeeConstants[committee].name
                          : committee}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
            <g transform={`translate(0, ${BOUNDS_HEIGHT})`}>
              <path
                className={styles.axis}
                d={["M", xRange[0], 0, "L", xRange[1], 0].join(" ")}
                fill="none"
                stroke="currentColor"
              />
            </g>
            <path
              className={styles.axis}
              d={["M", 0, yRange[0], "L", 0, yRange[1]].join(" ")}
              fill="none"
              stroke="currentColor"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
