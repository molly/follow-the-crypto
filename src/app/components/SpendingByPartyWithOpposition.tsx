import { ExpendituresByParty } from "../types/Expenditures";
import { formatCompact } from "../utils/humanize";
import { formatCurrency } from "../utils/utils";
import styles from "./home/HorizontalBars.module.css";

const GROUPS = [
  {
    header: "Support",
    rows: [
      { key: "rep_support" as const, label: "Republican" },
      { key: "dem_support" as const, label: "Democrat" },
    ],
  },
  {
    header: "Oppose",
    rows: [
      { key: "dem_oppose" as const, label: "Democrat" },
      { key: "rep_oppose" as const, label: "Republican" },
    ],
  },
];

export function SpendingByPartySkeleton() {
  return null;
}

export default function SpendingByPartyWithOpposition({
  expenditures,
  labelId: _labelId,
}: {
  expenditures: ExpendituresByParty;
  labelId: string;
}) {
  const allValues = GROUPS.flatMap((g) =>
    g.rows.map((r) => expenditures[r.key]),
  );
  const max = Math.max(...allValues, 0);

  return (
    <div className={styles.groups}>
      {GROUPS.map((group) => (
        <div key={group.header} className={styles.group}>
          <div className={styles.groupHeader}>{group.header}</div>
          {group.rows.map(({ key, label }) => {
            const value = expenditures[key];
            const pct = max > 0 ? (value / max) * 100 : 0;

            return (
              <div key={key} className={styles.inlineRow}>
                <span className={styles.inlineLabel}>{label}</span>
                {value > 0 ? (
                  <div
                    className={styles.inlineTrack}
                    role="img"
                    aria-label={`${label}: ${formatCurrency(value, true)}`}
                  >
                    <div className={styles.fill} style={{ width: `${pct}%` }} />
                  </div>
                ) : (
                  <span className={styles.inlineTrack} aria-hidden={true} />
                )}
                <span className={styles.inlineValue}>
                  {formatCompact(value)}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
