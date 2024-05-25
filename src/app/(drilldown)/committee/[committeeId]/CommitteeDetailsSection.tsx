import { currency } from "../../../utils/utils";

import sharedStyles from "@/app/shared.module.css";
import { CommitteeDetails } from "@/app/types/Committee";
import styles from "./page.module.css";

export default async function CommitteeDetailsSection({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  return (
    <>
      <section className={sharedStyles.fullWidth}>
        <h1>{committee.name}</h1>
        <span className="secondary">{committee.committee_type_full}</span>
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
            {currency(committee.receipts, true)}
          </h2>
          <span>raised this cycle</span>
        </div>
      </section>
    </>
  );
}
