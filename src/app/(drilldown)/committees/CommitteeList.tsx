import { fetchAllCommittees } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import Link from "next/link";

export default async function CommitteeList() {
  const data = await fetchAllCommittees();

  if (isError(data)) {
    return <ErrorText subject="the list of committees" />;
  }

  const committees = (data as CommitteeDetails[]).filter(
    (c) => c.contributions && c.contributions > 0,
  );

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
