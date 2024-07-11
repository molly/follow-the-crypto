import { formatDateFromString } from "../../../utils/utils";

import { fetchCommitteeDetails } from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import Skeleton from "@/app/components/skeletons/Skeleton";
import { CommitteeDetails } from "@/app/types/Committee";
import { is4xx, isError } from "@/app/utils/errors";
import styles from "./page.module.css";

export function CommitteeDetailsSkeleton() {
  return (
    <div>
      <Skeleton height="1.75rem" width="10rem" />
      <Skeleton width="90%" />
      <Skeleton width="60%" />
    </div>
  );
}

export default async function CommitteeDetailsSection({
  committeeId,
}: {
  committeeId: string;
}) {
  const committeeData = await fetchCommitteeDetails(committeeId);

  if (isError(committeeData)) {
    if (is4xx(committeeData)) {
      return <div className="secondary">Committee not found.</div>;
    } else {
      return <ErrorText subject="information about this committee" />;
    }
  }

  const committee = committeeData as CommitteeDetails;

  const renderDetails = (): string => {
    return ""
      .concat(
        committee.committee_type_full ? committee.committee_type_full : "",
      )
      .concat(
        committee.designation_full ? ` - ${committee.designation_full}` : "",
      )
      .concat(` | ID: ${committee.id}`)
      .concat(
        committee.first_f1_date
          ? ` | Registration date: ${formatDateFromString(committee.first_f1_date)}`
          : "",
      );
  };

  return (
    <>
      <section>
        <h1>{committee.name}</h1>
        <span className="secondary small">{renderDetails()}</span>
        {committee.description && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: committee.description }}
          ></div>
        )}
      </section>
      <section className={styles.moneyCardRow}></section>
    </>
  );
}
