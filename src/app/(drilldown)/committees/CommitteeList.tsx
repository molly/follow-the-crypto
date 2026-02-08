import { fetchCommitteesWithContributions } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import type { CommitteeConstantWithContributions } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import Link from "next/link";

export default async function CommitteeList() {
  const data = await fetchCommitteesWithContributions();

  if (isError(data)) {
    return <ErrorText subject="the list of committees" />;
  }

  const committees = data as CommitteeConstantWithContributions[];

  return (
    <ul className={sharedStyles.plainList}>
      {committees.map((committee) => (
        <li key={committee.id} className={sharedStyles.plainListItem}>
          <Link href={`/committees/${committee.id}`}>{committee.name}</Link>
        </li>
      ))}
    </ul>
  );
}
