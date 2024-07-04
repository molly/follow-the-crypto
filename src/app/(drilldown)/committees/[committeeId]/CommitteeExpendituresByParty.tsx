import SpendingByParty from "@/app/components/SpendingByParty";
import styles from "@/app/components/expenditures.module.css";
import { CommitteeDetails } from "@/app/types/Committee";

export default function CommitteeExpendituresByParty({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  const expenditures = committee.by_party;

  return (
    <section className={styles.card}>
      <h2 id="expenditures-label">Expenditures</h2>
      {expenditures ? (
        <SpendingByParty
          expenditures={expenditures}
          labelId="expenditures-label"
        />
      ) : (
        <p>No expenditures found.</p>
      )}
    </section>
  );
}
