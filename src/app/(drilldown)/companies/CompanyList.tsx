import { fetchConstant } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { CompanyCategory, CompanyConstant } from "@/app/types/Companies";
import Link from "next/link";
import styles from "./page.module.css";

function CompanyListGroup({
  title,
  groupIds,
  companies,
}: {
  title: string;
  groupIds: string[];
  companies: Record<string, CompanyConstant>;
}) {
  return (
    <>
      <h3 className={styles.subhead}>{title}</h3>
      <ul className={sharedStyles.plainList}>
        {groupIds.map((id) => (
          <li key={id} className={sharedStyles.plainListItem}>
            <Link href={`/companies/${id}`}>{companies[id].name}</Link>
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
  if (data === null) {
    return <ErrorText subject="the list of companies" />;
  }

  const companyGroups: Record<string, string[]> = Object.values(
    data as Record<string, CompanyConstant>,
  ).reduce<Record<string, string[]>>(
    (acc, { category, id }) => {
      if (category.includes("capital" as CompanyCategory)) {
        if (category.includes("crypto" as CompanyCategory)) {
          acc["crypto-capital"].push(id);
        } else {
          acc["capital"].push(id);
        }
      } else if (category.includes("advocacy" as CompanyCategory)) {
        acc["advocacy"].push(id);
      } else if (category.includes("crypto" as CompanyCategory)) {
        acc["crypto"].push(id);
      }
      return acc;
    },
    { capital: [], crypto: [], "crypto-capital": [], advocacy: [] },
  );
  for (const key in companyGroups) {
    companyGroups[key].sort();
  }
  const companies = data as Record<string, CompanyConstant>;

  return (
    <>
      <CompanyListGroup
        title="Cryptocurrency companies"
        groupIds={companyGroups["crypto"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Advocacy groups"
        groupIds={companyGroups["advocacy"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Crypto-specific investment companies"
        groupIds={companyGroups["crypto-capital"]}
        companies={companies}
      />
      <CompanyListGroup
        title="Investment companies"
        groupIds={companyGroups["capital"]}
        companies={companies}
      />
    </>
  );
}
