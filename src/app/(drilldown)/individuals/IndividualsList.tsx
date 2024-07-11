import { fetchConstant } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { IndividualConstant } from "@/app/types/Individuals";
import { ErrorType, isError } from "@/app/utils/errors";
import Link from "next/link";

export default async function IndividualsList() {
  const data = await fetchConstant<
    Record<string, IndividualConstant> | ErrorType
  >("individuals");

  if (isError(data)) {
    return <ErrorText subject="the list of individuals" />;
  }

  const individuals = Object.values(
    data as Record<string, IndividualConstant>,
  ).sort((a, b) =>
    a.id
      .split("-")
      .slice(1)
      .join("-")
      .localeCompare(b.id.split("-").slice(1).join("-")),
  );

  return (
    <ul className={sharedStyles.plainList}>
      {individuals.map((individual) => (
        <li key={individual.id} className={sharedStyles.plainListItem}>
          <Link href={`/individuals/${individual.id}`}>{individual.name}</Link>
          {individual.company && ` (${individual.company})`}
        </li>
      ))}
    </ul>
  );
}
