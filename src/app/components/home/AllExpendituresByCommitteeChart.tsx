"use client";
import styles from "@/app/components/expenditures.module.css";
import { useComponentSize } from "@/app/hooks/useComponentSize";
import { CommitteeConstant } from "@/app/types/Committee";
import { getLabelColor } from "@/app/utils/colors";
import * as d3 from "d3";

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
  labelId,
}: {
  expenditures: Record<string, number>;
  committeeConstants: Record<string, CommitteeConstant>;
  labelId: string;
}) {
  const { ref, width, height } = useComponentSize({ width: 400, height: 300 });

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
  const barLabelFormatter = (d: number) => d3.format("$.3s")(Math.abs(d));

  return (
    <div className={styles.svgWrapper}>
      <svg
        ref={ref}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className={styles.svg}
        role="group"
        aria-labelledby={labelId}
      >
        <g transform={`translate(0, ${MARGIN_TOP})`}>
          {y.ticks(5).map((tick) => (
            <g
              key={`xTick-${tick}`}
              transform={`translate(0,${y(tick)})`}
              role="presentation"
              aria-hidden={true}
            >
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
          <g
            transform={`translate(${MARGIN_LEFT}, 0)`}
            role="list"
            aria-label="bar graph"
          >
            {committees.map((committee) => {
              const spending = expenditures[committee];
              const height = y(0) - y(spending);
              const committeeName =
                committee in committeeConstants
                  ? committeeConstants[committee].name
                  : committee;
              return (
                <g
                  key={committee}
                  style={{ cursor: "pointer" }}
                  role="link"
                  aria-label={`~${barLabelFormatter(spending)} spent by ${committeeName}`}
                >
                  <a href={`/committees/${committee}`}>
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
                      className={styles.svgText}
                      textAnchor="middle"
                      aria-hidden={true}
                    >
                      {barLabelFormatter(spending)}
                    </text>
                    {height > 20 && (
                      <foreignObject
                        x={x(committee) || 0}
                        width={x.bandwidth()}
                        height={height - 5}
                        y={y(spending) + 5}
                        aria-hidden={true}
                      >
                        <div
                          className={styles.expendituresBarLabel}
                          style={{ color: getLabelColor(color(committee)) }}
                        >
                          {committeeName}
                        </div>
                      </foreignObject>
                    )}
                  </a>
                </g>
              );
            })}
            <g
              transform={`translate(0, ${BOUNDS_HEIGHT})`}
              role="presentation"
              aria-hidden={true}
            >
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
              role="presentation"
              aria-hidden={true}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
