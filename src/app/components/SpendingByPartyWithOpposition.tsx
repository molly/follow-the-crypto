"use client";

import * as d3 from "d3";
import { useComponentSize } from "../hooks/useComponentSize";
import { ExpendituresByParty } from "../types/Expenditures";
import styles from "./expenditures.module.css";

type Party = "rep" | "dem";
type SupportOppose = "support" | "oppose";

type ExpendituresByPartyKey = `${Party}_${SupportOppose}`;

const MARGIN_BOTTOM = 25;
const MARGIN_TOP = 15;
const MARGIN_LEFT = 40;

export function SpendingByPartySkeleton() {
  const maxExpenditure = 2000000;
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const fx = d3
    .scaleBand()
    .domain(["support", "oppose"])
    .range([0, 340])
    .paddingInner(0.1);
  const x = d3.scaleBand().domain(["rep", "dem"]).range([0, fx.bandwidth()]);
  const y = d3.scaleLinear().domain(yDomain).range([260, 0]);
  const xRange = fx.range();
  const yRange = y.range();

  const DUMMY_DATA = {
    dem_support: 1000000,
    dem_oppose: 500000,
    rep_support: 2000000,
    rep_oppose: 1500000,
  };

  return (
    <div className={styles.svgWrapper}>
      <svg
        viewBox={`0 0 400 300`}
        preserveAspectRatio="none"
        className={styles.svg}
        role="group"
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
            </g>
          ))}
          <g
            transform={`translate(${MARGIN_LEFT}, 0)`}
            role="list"
            aria-label="bar graph"
          >
            {["support", "oppose"].map((supportOppose) => (
              <g
                key={supportOppose}
                transform={`translate(${fx(supportOppose)},0)`}
              >
                {["dem", "rep"].map((party) => {
                  const key =
                    `${party}_${supportOppose}` as ExpendituresByPartyKey;
                  const spending = DUMMY_DATA[key];
                  const height = y(0) - y(spending);
                  const xBandwidth = x.bandwidth();
                  return (
                    <rect
                      key={key}
                      x={x(party)}
                      y={y(spending)}
                      width={xBandwidth}
                      height={height}
                      className={styles.skeletonBar}
                    />
                  );
                })}
                <g
                  transform={`translate(${fx.bandwidth() / 2},260)`}
                  role="presentation"
                  aria-hidden={true}
                >
                  <text
                    fontSize={14}
                    fontWeight="bold"
                    textAnchor="middle"
                    y={MARGIN_BOTTOM - 5}
                  >
                    {supportOppose === "support" ? "Support" : "Oppose"}
                  </text>
                </g>
              </g>
            ))}
            <g
              transform={`translate(0, 260)`}
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

export default function SpendingByPartyWithOpposition({
  expenditures,
  labelId,
}: {
  expenditures: ExpendituresByParty;
  labelId: string;
}) {
  const { ref, width, height } = useComponentSize({ width: 400, height: 300 });

  const CHART_WIDTH = width;
  const CHART_HEIGHT = height;
  const BOUNDS_WIDTH = CHART_WIDTH - MARGIN_LEFT;
  const BOUNDS_HEIGHT = CHART_HEIGHT - MARGIN_BOTTOM - MARGIN_TOP;

  const maxExpenditure = d3.max(Object.values(expenditures));
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const fx = d3
    .scaleBand()
    .domain(["support", "oppose"])
    .range([0, BOUNDS_WIDTH])
    .paddingInner(0.1);
  const x = d3.scaleBand().domain(["rep", "dem"]).range([0, fx.bandwidth()]);
  const y = d3.scaleLinear().domain(yDomain).range([BOUNDS_HEIGHT, 0]);
  const xRange = fx.range();
  const yRange = y.range();
  const gridLabelFormatter = (d: number) => d3.format("$.2s")(Math.abs(d));
  const barLabelFormatter = (d: number) => d3.format("$.3s")(Math.abs(d));

  const renderLabel = (label: string, width: number) => {
    return (
      <span title={label}>
        {width > 100 ? label : width > 50 ? label.slice(0, 3) : label[0]}
      </span>
    );
  };

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
            {["support", "oppose"].map((supportOppose) => (
              <g
                key={supportOppose}
                transform={`translate(${fx(supportOppose)},0)`}
              >
                {["dem", "rep"].map((party) => {
                  const key =
                    `${party}_${supportOppose}` as ExpendituresByPartyKey;
                  const spending = expenditures[key];
                  const height = y(0) - y(spending);
                  const xBandwidth = x.bandwidth();
                  return (
                    <g key={key} role="listitem">
                      <rect
                        x={x(party)}
                        y={y(spending)}
                        width={xBandwidth}
                        height={height}
                        className={party}
                        aria-label={`~${barLabelFormatter(spending)} spent to ${supportOppose} ${party === "rep" ? "Republican" : "Democratic"} candidates`}
                      />
                      <text
                        x={(x(party) || 0) + xBandwidth / 2}
                        fontSize={14}
                        y={y(spending) - 5}
                        textAnchor="middle"
                        aria-hidden={true}
                      >
                        {barLabelFormatter(spending)}
                      </text>
                      {height > 20 && (
                        <foreignObject
                          x={x(party) || 0}
                          width={xBandwidth}
                          height={height - 5}
                          y={y(spending) + 5}
                          role="presentation"
                          aria-hidden={true}
                        >
                          <div className={styles.expendituresBarLabel}>
                            {party === "rep" &&
                              renderLabel("Republicans", xBandwidth)}
                            {party === "dem" &&
                              renderLabel("Democrats", xBandwidth)}
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
                <g role="presentation" aria-hidden={true}>
                  <foreignObject
                    y={BOUNDS_HEIGHT + 2}
                    height={MARGIN_BOTTOM}
                    width={fx.bandwidth()}
                  >
                    <div className={styles.supportOpposeLabel}>
                      {supportOppose === "support" ? "Support" : "Oppose"}
                    </div>
                  </foreignObject>
                </g>
              </g>
            ))}
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
