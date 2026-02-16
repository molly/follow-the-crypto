"use client";
import styles from "@/app/components/expenditures.module.css";
import { useComponentSize } from "@/app/hooks/useComponentSize";
import { CommitteeConstantWithContributions } from "@/app/types/Committee";
import { getLabelColor } from "@/app/utils/colors";
import * as d3 from "d3";

const COLORS = {
  CASH: "#1e3a8a",
  CONTRIBUTED: "#2563eb",
  TRANSFERRED: "#60a5fa",
  CLAIMED: "#d9d9d9",
};

const BASE_LEGEND_ITEMS = [
  { label: "Transfers from other committees", color: COLORS.TRANSFERRED },
  { label: "Contributions", color: COLORS.CONTRIBUTED },
  { label: "Cash on hand", color: COLORS.CASH },
];

function getTopSegmentColor(committee: CommitteeConstantWithContributions) {
  // Make sure there's enough contrast in the text label
  if ((committee.claimedCommitted || 0) > 0) {
    return COLORS.CLAIMED;
  } else if (committee.total_transferred > 0) {
    return COLORS.TRANSFERRED;
  } else if (committee.total_contributed > 0) {
    return COLORS.CONTRIBUTED;
  }
  return COLORS.CASH;
}

export default function AllCashByCommitteeChart({
  committees,
  labelId,
}: {
  committees: CommitteeConstantWithContributions[];
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
  const HEIGHT_CUTOFF = 50;
  const LEGEND_ITEM_HEIGHT = 18;
  const LEGEND_SWATCH_SIZE = 12;

  const committeesToShow = committees.slice(0, 5);
  const hasClaimedCommitted = committeesToShow.some(
    (c) => (c.claimedCommitted || 0) > 0,
  );
  const legendItems = hasClaimedCommitted
    ? [
        { label: "Claimed commitments", color: COLORS.CLAIMED },
        ...BASE_LEGEND_ITEMS,
      ]
    : BASE_LEGEND_ITEMS;
  const maxExpenditure =
    d3.max(
      Object.values(committeesToShow),
      (c) => c.total + (c.claimedCommitted || 0),
    ) || 0;
  const yDomain = [0, maxExpenditure + maxExpenditure * 0.05]; // Add a little breathing room to the chart
  const x = d3
    .scaleBand()
    .domain(committeesToShow.map((c) => c.id))
    .range([0, BOUNDS_WIDTH])
    .paddingInner(0.1);
  const y = d3.scaleLinear().domain(yDomain).range([BOUNDS_HEIGHT, 0]);
  const xRange = x.range();
  const yRange = y.range();
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
            {committeesToShow.map((committee) => {
              const barTotal =
                committee.total + (committee.claimedCommitted || 0);
              const height = y(0) - y(barTotal);
              let committeeName = committee.name;
              if (committeeName === "Commonwealth Unity Fund") {
                committeeName = "Common&shy;wealth Unity Fund";
              }
              return (
                <g
                  key={committee.id}
                  style={{ cursor: "pointer" }}
                  role="link"
                  aria-label={`~${barLabelFormatter(barTotal)} on hand`}
                >
                  <a href={`/committees/${committee.id}`}>
                    <rect
                      x={x(committee.id)}
                      y={y(committee.last_cash_on_hand_end_period)}
                      width={x.bandwidth()}
                      height={y(0) - y(committee.last_cash_on_hand_end_period)}
                      fill={COLORS.CASH}
                    />
                    <rect
                      x={x(committee.id)}
                      y={y(
                        committee.last_cash_on_hand_end_period +
                          committee.total_contributed,
                      )}
                      width={x.bandwidth()}
                      height={
                        y(committee.last_cash_on_hand_end_period) -
                        y(
                          committee.last_cash_on_hand_end_period +
                            committee.total_contributed,
                        )
                      }
                      fill={COLORS.CONTRIBUTED}
                    />
                    <rect
                      x={x(committee.id)}
                      y={y(
                        committee.last_cash_on_hand_end_period +
                          committee.total_contributed +
                          committee.total_transferred,
                      )}
                      width={x.bandwidth()}
                      height={
                        y(
                          committee.last_cash_on_hand_end_period +
                            committee.total_contributed,
                        ) -
                        y(
                          committee.last_cash_on_hand_end_period +
                            committee.total_contributed +
                            committee.total_transferred,
                        )
                      }
                      fill={COLORS.TRANSFERRED}
                    />
                    {(committee.claimedCommitted || 0) > 0 && (
                      <rect
                        x={x(committee.id)}
                        y={y(
                          committee.total + (committee.claimedCommitted || 0),
                        )}
                        width={x.bandwidth()}
                        height={
                          y(committee.total) -
                          y(committee.total + (committee.claimedCommitted || 0))
                        }
                        fill={COLORS.CLAIMED}
                      />
                    )}
                    <text
                      x={(x(committee.id) || 0) + x.bandwidth() / 2}
                      fontSize={14}
                      y={
                        y(barTotal) -
                        ((committee.claimedCommitted || 0) > 0 ? 19 : 5)
                      }
                      className={styles.svgText}
                      textAnchor="middle"
                      aria-hidden={true}
                    >
                      {barLabelFormatter(barTotal)}
                      {(committee.claimedCommitted || 0) > 0 && (
                        <tspan fontSize={10} x={(x(committee.id) || 0) + x.bandwidth() / 2} dy={14}>
                          {committee.total === 0
                            ? "(claimed)"
                            : `(${barLabelFormatter(committee.claimedCommitted || 0)} claimed)`}
                        </tspan>
                      )}
                    </text>
                    <foreignObject
                      x={x(committee.id) || 0}
                      width={x.bandwidth()}
                      height={height > HEIGHT_CUTOFF ? height - 5 : 70}
                      y={
                        height > HEIGHT_CUTOFF
                          ? y(barTotal) + 5
                          : y(barTotal) - 90
                      }
                      aria-hidden={true}
                    >
                      <div
                        className={
                          height > HEIGHT_CUTOFF
                            ? styles.expendituresBarLabel
                            : styles.expendituresBarLabelOffBar
                        }
                        style={{
                          color:
                            height > HEIGHT_CUTOFF
                              ? getLabelColor(getTopSegmentColor(committee))
                              : undefined,
                        }}
                      >
                        <span
                          className={styles.expendituresBarLabelSpan}
                          dangerouslySetInnerHTML={{ __html: committeeName }}
                        />
                      </div>
                    </foreignObject>
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
        <g>
          {legendItems.map((item, i) => (
            <g
              key={item.label}
              transform={`translate(${BOUNDS_WIDTH - 150}, ${i * LEGEND_ITEM_HEIGHT})`}
            >
              <rect
                width={LEGEND_SWATCH_SIZE}
                height={LEGEND_SWATCH_SIZE}
                fill={item.color}
              />
              <text
                x={LEGEND_SWATCH_SIZE + 6}
                y={LEGEND_SWATCH_SIZE - 2}
                fontSize={12}
                alignmentBaseline="alphabetic"
              >
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
