import styles from "@/app/components/expenditures.module.css";
import * as d3 from "d3";

export default function ExpendituresSkeleton() {
  const MARGIN_BOTTOM = 20;
  const MARGIN_TOP = 15;
  const MARGIN_LEFT = 40;
  const CHART_WIDTH = 400;
  const CHART_HEIGHT = 200;
  const BOUNDS_WIDTH = CHART_WIDTH - MARGIN_LEFT;
  const BOUNDS_HEIGHT = CHART_HEIGHT - MARGIN_BOTTOM - MARGIN_TOP;

  const DUMMY_DATA: Record<string, number> = {
    "1": 20000000,
    "2": 18000000,
    "3": 10000000,
    "4": 1400000,
  };

  const maxExpenditure = 20000000;
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05];
  const x = d3
    .scaleBand()
    .domain(["1", "2", "3", "4"])
    .range([0, BOUNDS_WIDTH])
    .paddingInner(0.1);
  const y = d3.scaleLinear().domain(yDomain).range([BOUNDS_HEIGHT, 0]);
  const xRange = x.range();
  const yRange = y.range();
  const color = d3.scaleOrdinal(["1", "2", "3", "4"], d3.schemeGreys[4]);

  return (
    <div className={styles.svgWrapper}>
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
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
            </g>
          ))}
          <g transform={`translate(${MARGIN_LEFT}, 0)`}>
            {["1", "2", "3", "4"].map((key) => {
              const spending = DUMMY_DATA[key];
              const height = y(0) - y(spending);
              return (
                <rect
                  key={`expenditures-skeleton-${key}`}
                  x={x(key)}
                  y={y(spending)}
                  width={x.bandwidth()}
                  height={height}
                  fill={color(key)}
                />
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
