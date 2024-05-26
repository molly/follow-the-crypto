import { formatCurrency, formatDate } from "../../../utils/utils";

import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import styles from "./page.module.css";

export default async function CommitteeDetailsSection({
  committee,
}: {
  committee: CommitteeDetails;
}) {
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
          ? ` | Registration date: ${formatDate(committee.first_f1_date)}`
          : "",
      );
  };

  return (
    <>
      <section className={sharedStyles.fullWidth}>
        <h1>{committee.name}</h1>
        <span className="secondary">{renderDetails()}</span>
        {committee.description && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: committee.description }}
          ></div>
        )}
      </section>
      <section className={sharedStyles.smallCard}>
        <div className={styles.receiptsSection}>
          <h2 className={styles.receipts}>
            {formatCurrency(committee.receipts, true)}
          </h2>
          <span>raised this cycle</span>
        </div>
      </section>
    </>
  );
}
