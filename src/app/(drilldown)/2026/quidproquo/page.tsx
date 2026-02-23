import { fetchAllRecipients, fetchBeneficiaries } from "@/app/actions/fetch";
import tableStyles from "@/app/components/tables.module.css";
import { qpqData } from "@/app/data/qpq";
import { TRUMP_CANDIDATE_ID } from "@/app/data/trump";
import {
  type Beneficiary,
  type CompanyContributionGroup,
} from "@/app/types/Beneficiaries";
import { type RecipientDetails } from "@/app/types/Contributions";
import { QPQ } from "@/app/types/Qpq";
import { isError } from "@/app/utils/errors";
import { humanizeRoundedCurrency } from "@/app/utils/humanize";
import { customMetadata } from "@/app/utils/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Quid Pro Quo",
  description:
    "Cryptocurrency companies are reaping the benefits of their contributions to Trump and other pro-crypto politicians.",
});

export default async function QuidProQuoPage() {
  // Fetch Trump PAC contribution data from the backend
  const [beneficiariesResult, recipientsResult] = await Promise.all([
    fetchBeneficiaries(),
    fetchAllRecipients(),
  ]);

  // Build a map of company_id -> total contributions to Trump PACs
  const trumpContribsByCompany = new Map<string, number>();
  if (!isError(beneficiariesResult) && !isError(recipientsResult)) {
    const beneficiaries = beneficiariesResult as Record<string, Beneficiary>;
    const recipients = recipientsResult as Record<string, RecipientDetails>;

    // Discover all Trump-affiliated committee IDs
    const trumpCommitteeIds = new Set<string>([TRUMP_CANDIDATE_ID]);
    for (const [id, details] of Object.entries(recipients)) {
      if (
        details.candidate_ids?.includes(TRUMP_CANDIDATE_ID) ||
        details.sponsor_candidate_ids?.includes(TRUMP_CANDIDATE_ID)
      ) {
        trumpCommitteeIds.add(id);
      }
    }

    // Aggregate Trump PAC contributions by company across all Trump committees
    for (const [id, beneficiary] of Object.entries(beneficiaries)) {
      if (trumpCommitteeIds.has(id)) {
        for (const group of beneficiary.contributions as CompanyContributionGroup[]) {
          const existing = trumpContribsByCompany.get(group.company_id) || 0;
          trumpContribsByCompany.set(group.company_id, existing + group.total);
        }
      }
    }
  }

  // Extract company ID from a QPQ link like "/2026/companies/coinbase"
  const getCompanyId = (entry: QPQ): string | null => {
    if (!entry.link) {
      return null;
    }
    const match = entry.link.match(/^\/2026\/companies\/(.+)$/);
    return match ? match[1] : null;
  };

  const getTotalAmount = (entry: QPQ): number => {
    const manualAmount =
      "contributions" in entry && entry.contributions
        ? entry.contributions.reduce(
            (acc, curr) => acc + ("amount" in curr ? curr.amount || 0 : 0),
            0,
          )
        : 0;
    const companyId = getCompanyId(entry);
    const trumpTotal =
      companyId !== null ? (trumpContribsByCompany.get(companyId) ?? 0) : 0;
    return manualAmount + trumpTotal;
  };

  const sortedQpq = Object.values(qpqData).sort((a, b) => {
    const aAmount = getTotalAmount(a);
    const bAmount = getTotalAmount(b);
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
    type Item = { amount?: number; jsx: React.ReactElement };

    const manualContributions =
      "contributions" in entry && entry.contributions
        ? entry.contributions
        : [];

    const allItems: Item[] = manualContributions.map((contribution) => {
      if (contribution.amount) {
        return {
          amount: contribution.amount,
          jsx: (
            <li
              key={contribution.recipient}
            >{`${humanizeRoundedCurrency(contribution.amount)} ${contribution.recipient}`}</li>
          ),
        };
      }
      return {
        jsx: <li key={contribution.benefit}>{contribution.benefit}</li>,
      };
    });

    const companyId = getCompanyId(entry);
    const trumpTotal =
      companyId !== null ? trumpContribsByCompany.get(companyId) : undefined;
    if (trumpTotal) {
      allItems.push({
        amount: trumpTotal,
        jsx: (
          <li key="trump-fec">
            {humanizeRoundedCurrency(Math.floor(trumpTotal / 10000) * 10000)} to
            Trump-affiliated PACs (2026)
          </li>
        ),
      });
    }

    allItems.sort((a, b) => {
      if (a.amount !== undefined && b.amount !== undefined) {
        return b.amount - a.amount;
      }
      if (a.amount !== undefined) {
        return -1;
      }
      if (b.amount !== undefined) {
        return 1;
      }
      return 0;
    });

    return allItems.map((item) => item.jsx);
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
            {sortedQpq.map((entry) => {
              const contributions = renderContribution(entry);
              return (
                <tr key={entry.name} className={tableStyles.qpqRow}>
                  <td>{renderName(entry)}</td>
                  <td>
                    <ul>{renderBenefit(entry)}</ul>
                  </td>
                  <td>
                    {contributions.length > 0 && <ul>{contributions}</ul>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
