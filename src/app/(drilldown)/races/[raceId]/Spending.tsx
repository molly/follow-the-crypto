import Candidate from "@/app/components/Candidate";
import { CandidateSummary, ElectionGroup } from "@/app/types/Elections";
import * as d3 from "d3";
import styles from "./page.module.css";

const CHART_WIDTH = 300;
const MARGIN_TOP = 0;
const MARGIN_LEFT = 80;
const MARGIN_RIGHT = 5;
const MARGIN_BOTTOM = 50;
const BOUNDS_WIDTH = CHART_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const HATCH_SIZE = 2;

function getTotalSpending(candidate: CandidateSummary) {
  return (
    (candidate.outside_spending?.support_total || 0) +
    (candidate.outside_spending?.oppose_total || 0) +
    (candidate.raised_total || 0)
  );
}

export default function Spending({
  raceId,
  election,
}: {
  raceId: string;
  election: ElectionGroup;
}) {
  // Get unique list of candidates, ordered by amount raised
  const candidateNames = Object.keys(election.candidates).sort(
    (a, b) =>
      getTotalSpending(election.candidates[b]) -
      getTotalSpending(election.candidates[a]),
  );

  const CHART_HEIGHT = candidateNames.length * 50;
  const BOUNDS_HEIGHT = CHART_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;
  const LEGEND_Y = CHART_HEIGHT - 20;

  // TODO: Cache
  const data = candidateNames.map((candidate) => {
    const summary = election.candidates[candidate];
    const candidateData = {
      raised: 0,
      outside_support: 0,
      outside_oppose: 0,
      crypto_support: 0,
      crypto_oppose: 0,
    };
    if (!summary) {
      return candidateData;
    }
    candidateData.raised = summary.raised_total || 0;
    candidateData.crypto_support = summary.support_total || 0;
    candidateData.crypto_oppose = summary.oppose_total || 0;
    if ("outside_spending" in summary && summary.outside_spending) {
      candidateData.outside_support =
        summary.outside_spending.support_total || 0;
      candidateData.outside_oppose = summary.outside_spending.oppose_total || 0;
    }
    return candidateData;
  });

  const keys = ["raised", "outside_support", "outside_oppose"];
  const y = d3
    .scaleBand()
    .domain(candidateNames)
    .range([MARGIN_TOP, BOUNDS_HEIGHT])
    .padding(0.2);
  const yGroup = d3
    .scaleBand()
    .domain(keys)
    .range([0, y.bandwidth()])
    .padding(0.1);
  const x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d3.max(keys, (key) => d[key])) as number])
    .range([0, BOUNDS_WIDTH]);
  const gridLabelFormatter = d3.format("$.2s");

  return (
    <div>
      <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
        <defs>
          <pattern
            id="hatch"
            width={HATCH_SIZE}
            height={HATCH_SIZE}
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect width={HATCH_SIZE / 2} height={HATCH_SIZE} fill="#334155" />
          </pattern>
        </defs>
        <g
          width={BOUNDS_WIDTH}
          height={BOUNDS_HEIGHT}
          transform={`translate(${MARGIN_LEFT},${MARGIN_TOP})`}
        >
          {x.ticks(5).map((value, ind) => {
            return (
              <g key={ind}>
                <line
                  x1={x(value)}
                  x2={x(value)}
                  y1={0}
                  y2={BOUNDS_HEIGHT}
                  strokeWidth={0.5}
                  className={styles.gridLine}
                />
                <text
                  x={x(value)}
                  y={BOUNDS_HEIGHT + 10}
                  textAnchor="middle"
                  fontSize={7}
                >
                  {gridLabelFormatter(value)}
                </text>
              </g>
            );
          })}
        </g>
        {candidateNames.map((candidate, ind) => {
          return (
            <g
              key={candidate}
              transform={`translate(${MARGIN_LEFT},${y(candidate)})`}
            >
              {keys.map((key, keyInd) => {
                let cryptoBar = null;
                let supportOppose;
                if (
                  (key === "outside_support" && data[ind].crypto_support > 0) ||
                  (key === "outside_oppose" && data[ind].crypto_oppose > 0)
                ) {
                  supportOppose =
                    key === "outside_support" ? "support" : "oppose";
                  const width = data[ind][`crypto_${supportOppose}`];
                  cryptoBar = (
                    <rect
                      x={x(0)}
                      y={yGroup(key)}
                      width={x(width)}
                      height={yGroup.bandwidth()}
                      fill="url(#hatch)"
                    />
                  );
                }
                return (
                  <g key={`${candidate}-${key}`}>
                    <rect
                      x={x(0)}
                      y={yGroup(key)}
                      width={x(data[ind][key] || 0)}
                      height={yGroup.bandwidth()}
                      className={styles[`${key}Bar`]}
                    />
                    {cryptoBar}
                  </g>
                );
              })}
              <foreignObject
                x={-MARGIN_LEFT}
                width={MARGIN_LEFT - 5}
                y={yGroup("outside_support")}
                height={30}
              >
                <div className={styles.candidateLabel}>
                  <Candidate
                    // candidate={candidates[ind]}
                    candidateSummary={
                      candidate in election.candidates
                        ? election.candidates[candidate]
                        : undefined
                    }
                    chart={true}
                  />
                  <div className={styles.candidateLabelName}>{candidate}</div>
                </div>
              </foreignObject>
            </g>
          );
        })}
        <g>
          <g>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              className={styles.raisedBar}
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div className={styles.spendingLegend}>$ raised by candidate</div>
            </foreignObject>
          </g>
          <g transform={`translate(${CHART_WIDTH / 4}, 0)`}>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              className={styles.outside_supportBar}
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div className={styles.spendingLegend}>
                Outside spending to support
              </div>
            </foreignObject>
          </g>
          <g transform={`translate(${(CHART_WIDTH * 2) / 4}, 0)`}>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              className={styles.outside_opposeBar}
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div className={styles.spendingLegend}>
                Outside spending to oppose
              </div>
            </foreignObject>
          </g>
          <g transform={`translate(${(CHART_WIDTH * 3) / 4}, 0)`}>
            <rect
              x={0}
              y={LEGEND_Y}
              width={10}
              height={10}
              fill="url(#hatch)"
            />
            <foreignObject x={12} y={LEGEND_Y - 5} width={65} height={20}>
              <div className={styles.spendingLegend}>Crypto spending</div>
            </foreignObject>
          </g>
        </g>
      </svg>
    </div>
  );
}
