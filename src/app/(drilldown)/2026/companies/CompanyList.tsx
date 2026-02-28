import { fetchCompanyTotalSpending, fetchConstant } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import {
  CompanyCategory,
  CompanyConstant,
  CompanyTotals,
} from "@/app/types/Companies";
import { isError } from "@/app/utils/errors";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

type CompanyGroup = {
  id: string;
  total: number;
};

function CompanyListGroup({
  title,
  groups,
  companies,
}: {
  title: string;
  groups: CompanyGroup[];
  companies: Record<string, CompanyConstant>;
}) {
  return (
    <>
      <h3 className={styles.subhead}>{title}</h3>
      <ul className={sharedStyles.plainList}>
        {groups.map(({ id, total }) => (
          <li key={id} className={sharedStyles.plainListItem}>
            <Link href={`/2026/companies/${id}`}>{companies[id].name}</Link>
            {` - ${formatCurrency(total)}`}
          </li>
        ))}
      </ul>
    </>
  );
}

export default async function CompanyList() {
  const data = await fetchConstant<Record<string, CompanyConstant> | null>(
    "companies",
  );
  const totalsData = await fetchCompanyTotalSpending();
  if (data === null) {
    return <ErrorText subject="the list of companies" />;
  }
  let totals: Record<string, any> = {};
  if (!isError(totalsData)) {
    totals = (totalsData as CompanyTotals).by_company;
  }

  const companyGroups: Record<string, CompanyGroup[]> = Object.values(
    data as Record<string, CompanyConstant>,
  ).reduce<Record<string, CompanyGroup[]>>(
    (acc, { category, id }) => {
      const companyGroup = { id, total: totals[id]?.total || 0 };
      if (category) {
        if (category.includes("capital" as CompanyCategory)) {
          if (category.includes("crypto" as CompanyCategory)) {
            acc["crypto-capital"].push(companyGroup);
          } else {
            acc["capital"].push(companyGroup);
          }
        } else if (category.includes("finance" as CompanyCategory)) {
          acc["finance"].push(companyGroup);
        } else if (category.includes("prediction" as CompanyCategory)) {
          acc["prediction"].push(companyGroup);
        } else if (category.includes("advocacy" as CompanyCategory)) {
          acc["advocacy"].push(companyGroup);
        } else if (category.includes("crypto" as CompanyCategory)) {
          acc["crypto"].push(companyGroup);
        }
      }
      return acc;
    },
    {
      capital: [],
      crypto: [],
      "crypto-capital": [],
      advocacy: [],
      finance: [],
      prediction: [],
    },
  );
  for (const key in companyGroups) {
    companyGroups[key].sort((a, b) => b.total - a.total);
  }
  const companies = data as Record<string, CompanyConstant>;

  return (
    <>
      <CompanyListGroup
        title="Cryptocurrency companies"
        groups={companyGroups["crypto"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Advocacy groups"
        groups={companyGroups["advocacy"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Crypto-specific investment companies"
        groups={companyGroups["crypto-capital"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Investment companies"
        groups={companyGroups["capital"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Finance companies with crypto involvement"
        groups={companyGroups["finance"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Prediction markets"
        groups={companyGroups["prediction"]}
        companies={companies}
      />
    </>
  );
}
