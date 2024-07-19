import { fetchConstant } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { CompanyConstant } from "@/app/types/Companies";
import Link from "next/link";

export default async function CompanyList() {
  const data = await fetchConstant<Record<string, CompanyConstant> | null>(
    "companies",
  );

  if (data === null) {
    return <ErrorText subject="the list of companies" />;
  }

  const companies = Object.values(data as Record<string, CompanyConstant>).sort(
    (a, b) => a.id.localeCompare(b.id),
  );

  return (
    <ul className={sharedStyles.plainList}>
      {companies.map((company) => (
        <li key={company.id} className={sharedStyles.plainListItem}>
          <Link href={`/companies/${company.id}`}>{company.name}</Link>
        </li>
      ))}
    </ul>
  );
}
