import styles from "./chloroplethMap.module.css";

const LEGEND_WIDTH = 300;

export default function Legend({
  fillClassNames,
  domain,
}: {
  fillClassNames: string[];
  domain: number[];
}) {
  const segmentWidth = LEGEND_WIDTH / (domain.length + 1);

  const getLabelText = (amount: number) => {
    if (amount === 0) {
      return "0";
    } else if (amount < 1000) {
      return `${amount}`;
    } else if (amount < 1000000) {
      return `${(amount / 1000).toFixed(0)}k`;
    } else {
      return `${(amount / 1000000).toFixed(0)}M`;
    }
  };

  return (
    <g
      className={styles.legend}
      transform="translate(610, 30)"
      role="presentation"
      aria-hidden={true}
    >
      <svg width={LEGEND_WIDTH} height={50} viewBox={`0 0 ${LEGEND_WIDTH} 50`}>
        <g>
          {domain.map((d, ind) => (
            <rect
              key={`legend-segment-${ind}`}
              x={ind * segmentWidth + 1}
              y="18"
              width={segmentWidth}
              height={8}
              className={styles[fillClassNames[ind]]}
            />
          ))}
        </g>
        <g transform="translate(0,28)">
          <text
            className={styles.svgText}
            x="0"
            y="-15"
            textAnchor="start"
            fontSize={12}
            fontWeight="bold"
            stroke="none"
          >
            Total expenditures ($)
          </text>
          {domain.map((d, ind) => (
            <g
              key={`legend-tick-${ind}`}
              transform={`translate(${(ind + 1) * segmentWidth + 1})`}
              fontSize={10}
            >
              <line y2="6" y1="-10"></line>
              <text
                className={styles.svgText}
                stroke="none"
                y={15}
                textAnchor="middle"
              >
                {getLabelText(d)}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </g>
  );
}
