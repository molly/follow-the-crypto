import Candidate from "@/app/components/Candidate";
import { CandidateSummary, ElectionGroup } from "@/app/types/Elections";
import * as d3 from "d3";
import styles from "./page.module.css";

const CHART_WIDTH = 300;
const GRIDLINE_WIDTH = 0.5;
const HATCH_SIZE = 2;
const MARGIN_RIGHT = 20;
const LEGEND_Y = 5;
const LEGEND_HEIGHT = 30;
const CANDIDATE_LABEL_WIDTH = 100;
const GRID_LABEL_HEIGHT = 15;
const BAR_LABEL_MIN_WIDTH = 16;

function getTotalSpending(candidate: CandidateSummary) {
  return (
    (candidate.outside_spending?.support_total || 0) +
    (candidate.outside_spending?.oppose_total || 0) +
    (candidate.raised_total || 0)
  );
}

function BarLabel({
  x,
  width,
  y,
  height,
  label,
  negative,
  backgroundClass,
}: {
  x: number;
  width: number;
  y: number;
  height: number;
  label: string;
  negative?: boolean;
  backgroundClass?: string;
}) {
  let textStart, hug;
  if (negative) {
    textStart =
      width > BAR_LABEL_MIN_WIDTH ? x + 1 : x - BAR_LABEL_MIN_WIDTH - 1;
    hug = width > BAR_LABEL_MIN_WIDTH ? "hugLeft" : "hugRight";
  } else {
    textStart =
      width > BAR_LABEL_MIN_WIDTH ? x - BAR_LABEL_MIN_WIDTH - 1 : x + 1;
    hug = width > BAR_LABEL_MIN_WIDTH ? "hugRight" : "hugLeft";
  }

  return (
    <foreignObject
      x={textStart}
      y={y}
      width={BAR_LABEL_MIN_WIDTH}
      height={height}
    >
      <div className={`${styles.barLabel} ${styles[hug]}`}>
        <div className={width > BAR_LABEL_MIN_WIDTH ? backgroundClass : ""}>
          {label}
        </div>
      </div>
    </foreignObject>
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

  const CHART_HEIGHT = candidateNames.length * 40;

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

  const xDomain = [
    -(d3.max(data, (d) => d.outside_oppose) || 0),
    d3.max(data, (d) => d.raised + d.outside_support) || 0,
  ];
  const y = d3
    .scaleBand()
    .range([LEGEND_HEIGHT, CHART_HEIGHT - GRID_LABEL_HEIGHT])
    .domain(candidateNames)
    .padding(0.5);
  const x = d3
    .scaleLinear()
    .domain(xDomain)
    .range([CANDIDATE_LABEL_WIDTH, CHART_WIDTH - MARGIN_RIGHT]);
  const gridLabelFormatter = d3.format("$.2s");
  const textOffset = y.bandwidth() / 2;
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
        {x.ticks(5).map((value, ind) => {
          return (
            <g key={`tick-${ind}`}>
              <line
                x1={x(value)}
                x2={x(value)}
                y1={CHART_HEIGHT - GRID_LABEL_HEIGHT}
                y2={LEGEND_HEIGHT}
                strokeWidth={GRIDLINE_WIDTH}
                className={value === 0 ? styles.mainGridLine : styles.gridLine}
              />
              <text
                x={x(value)}
                y={CHART_HEIGHT - GRID_LABEL_HEIGHT + 10}
                textAnchor="middle"
                fontSize={7}
              >
                {gridLabelFormatter(value)}
              </text>
            </g>
          );
        })}
        {candidateNames.map((candidate, ind) => {
          const {
            raised,
            outside_support,
            crypto_support,
            outside_oppose,
            crypto_oppose,
          } = data[ind];
          const yCandidate = y(candidate) || 0;
          const x0 = x(0);
          const xRaised = x(raised);
          const xRaisedWidth = Math.max(1, xRaised - x0);
          const xOutsideSupport = x(outside_support) - x0;
          const xOutsideSupportWidth = Math.max(1, xOutsideSupport);
          const xCryptoSupport = x(crypto_support) - x0;
          const xCryptoSupportWidth = Math.max(1, xCryptoSupport);
          const xOutsideOpposeStart = Math.min(x0 - 1, x(-outside_oppose));
          const xOutsideOpposeWidth =
            Math.max(1, x(outside_oppose) - x0) - GRIDLINE_WIDTH / 2;
          const xCryptoOpposeStart = Math.min(x0 - 1, x(-crypto_oppose));
          const xCryptoOpposeWidth =
            Math.max(1, x(crypto_oppose) - x0) - GRIDLINE_WIDTH / 2;
          return (
            <g key={candidate}>
              {raised && (
                <g>
                  <rect
                    x={x0 + GRIDLINE_WIDTH / 2}
                    y={yCandidate}
                    width={xRaisedWidth - GRIDLINE_WIDTH / 2}
                    height={y.bandwidth()}
                    className={styles.raisedBar}
                  />
                  <BarLabel
                    x={xRaised}
                    width={xRaisedWidth}
                    y={yCandidate}
                    height={y.bandwidth()}
                    label={gridLabelFormatter(raised)}
                  />
                </g>
              )}
              {outside_support && (
                <g>
                  <rect
                    x={xRaised}
                    y={yCandidate}
                    width={xOutsideSupportWidth}
                    height={y.bandwidth()}
                    className={styles.outside_supportBar}
                  />
                  {crypto_support && (
                    <g>
                      <rect
                        x={xRaised}
                        y={yCandidate}
                        width={xCryptoSupportWidth}
                        height={y.bandwidth()}
                        fill="url(#hatch)"
                      />
                      <BarLabel
                        x={xRaised + xCryptoSupportWidth}
                        width={xCryptoSupportWidth}
                        y={yCandidate}
                        height={y.bandwidth()}
                        label={gridLabelFormatter(crypto_support)}
                        backgroundClass={styles.barLabelSupport}
                      />
                    </g>
                  )}
                  <BarLabel
                    x={xRaised + xOutsideSupportWidth}
                    width={xOutsideSupportWidth}
                    y={yCandidate}
                    height={y.bandwidth()}
                    label={gridLabelFormatter(outside_support)}
                    backgroundClass={styles.barLabelSupport}
                  />
                </g>
              )}
              {outside_oppose && (
                <g>
                  <rect
                    x={xOutsideOpposeStart}
                    y={yCandidate}
                    width={xOutsideOpposeWidth}
                    height={y.bandwidth()}
                    className={styles.outside_opposeBar}
                  />
                  {crypto_oppose && (
                    <g>
                      <rect
                        x={xCryptoOpposeStart}
                        y={yCandidate}
                        width={xCryptoOpposeWidth}
                        height={y.bandwidth()}
                        fill="url(#hatch)"
                      />
                      <BarLabel
                        x={xCryptoOpposeStart}
                        width={xCryptoOpposeWidth}
                        y={yCandidate}
                        height={y.bandwidth()}
                        label={gridLabelFormatter(crypto_oppose)}
                        negative={true}
                        backgroundClass={styles.barLabelOppose}
                      />
                    </g>
                  )}
                  <BarLabel
                    x={xOutsideOpposeStart}
                    width={xOutsideOpposeWidth}
                    y={yCandidate}
                    height={y.bandwidth()}
                    negative={true}
                    label={gridLabelFormatter(outside_oppose)}
                    backgroundClass={styles.barLabelOppose}
                  />
                </g>
              )}
              <foreignObject
                x={0}
                width={CANDIDATE_LABEL_WIDTH - 25}
                y={yCandidate - y.bandwidth() / 2}
                height={y.bandwidth() * 2}
              >
                <div className={styles.candidateLabel}>
                  <Candidate
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
              <div className={styles.spendingLegend}>Raised by candidate</div>
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