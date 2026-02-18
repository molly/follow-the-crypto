import tableStyles from "@/app/components/tables.module.css";
import { qpqData } from "@/app/data/qpq";
import { QPQ } from "@/app/types/Qpq";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Quid Pro Quo",
  description:
    "Cryptocurrency companies are reaping the benefits of their contributions to Trump and other pro-crypto politicians.",
});

export default async function QuidProQuoPage() {
  const sortedQpq = Object.values(qpqData).sort((a, b) => {
    const aAmount =
      "contributions" in a && a.contributions
        ? a.contributions.reduce(
            (acc, curr) => acc + ("amount" in curr ? curr.amount || 0 : 0),
            0,
          )
        : 0;
    const bAmount =
      "contributions" in b && b.contributions
        ? b.contributions.reduce(
            (acc, curr) => acc + ("amount" in curr ? curr.amount || 0 : 0),
            0,
          )
        : 0;
    if (aAmount === bAmount) {
      return a.name.localeCompare(b.name);
    }
    return bAmount - aAmount;
  });

  const renderName = (entry: QPQ) => {
    if (entry.link) {
      return <Link href={entry.link}>{entry.name}</Link>;
    }
    return entry.name;
  };

  const renderBenefit = (entry: QPQ) => {
    return entry.benefits.map((benefit) => <li key={benefit}>{benefit}</li>);
  };

  const renderContribution = (entry: QPQ) => {
    const sortedContributions =
      "contributions" in entry && entry.contributions
        ? entry.contributions.sort((a, b) => (b.amount || 0) - (a.amount || 0))
        : [];
    return sortedContributions.map((contribution) => {
      if (contribution.amount) {
        return (
          <li
            key={contribution.recipient}
          >{`${humanizeRoundedCurrency(contribution.amount)} ${contribution.recipient}`}</li>
        );
      }
      return <li key={contribution.benefit}>{contribution.benefit}</li>;
    });
  };

  return (
    <div className={styles.page}>
      <h1 className="no-margin">Quid pro quo</h1>
      <div className={tableStyles.qpqCard}>
        <div className={tableStyles.tableCardContent}>
          Cryptocurrency companies are reaping the benefits of their
          contributions to Trump and other pro-crypto politicians.
        </div>
        <table className={styles.qpqTable}>
          <thead>
            <tr>
              <th className={styles.companyColumn}>Company</th>
              <th>Benefit</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            {sortedQpq.map((entry) => (
              <tr key={entry.name} className={tableStyles.qpqRow}>
                <td>{renderName(entry)}</td>
                <td>
                  <ul>{renderBenefit(entry)}</ul>
                </td>
                <td>
                  {"contributions" in entry && entry.contributions && (
                    <ul>{renderContribution(entry)}</ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
