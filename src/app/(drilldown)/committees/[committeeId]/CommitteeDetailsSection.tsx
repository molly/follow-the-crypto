import { formatCurrency, formatDateFromString } from "../../../utils/utils";

import MoneyCard from "@/app/components/MoneyCard";
import { CommitteeDetails } from "@/app/types/Committee";
import { Contributions } from "@/app/types/Contributions";
import CommitteeExpendituresTotal from "./CommitteeExpendituresTotal";
import styles from "./page.module.css";

export default async function CommitteeDetailsSection({
  committee,
  donors,
}: {
  committee: CommitteeDetails;
  donors: Contributions;
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
          ? ` | Registration date: ${formatDateFromString(committee.first_f1_date)}`
          : "",
      );
  };

  const total = donors.total_contributed + donors.total_transferred;
  return (
    <>
      <section>
        <h1>{committee.name}</h1>
        <span className="secondary smaller">{renderDetails()}</span>
        {committee.description && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: committee.description }}
          ></div>
        )}
      </section>
      <section className={styles.moneyCardRow}>
        <MoneyCard
          amount={formatCurrency(total || 0, true)}
          topText={<span>{`${committee.name} has raised`}</span>}
          bottomText={
            donors.total_transferred > 0 ? (
              <div className={styles.raisedDetails}>
                <div>
                  {`${formatCurrency(donors.total_contributed, true)} came from direct contributions.`}
                </div>
                <div>
                  {`${formatCurrency(donors.total_transferred, true)} was transferred from other committees.`}
                </div>
              </div>
            ) : undefined
          }
        />
        <CommitteeExpendituresTotal committeeId={committee.id} />
      </section>
    </>
  );
}
