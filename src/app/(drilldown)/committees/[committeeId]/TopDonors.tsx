import {
  Contributions,
  ContributionsGroup as ContributionsGroupType,
} from "@/app/types/Contributions";
import ContributionsGroup from "./ContributionsGroup";
import styles from "./page.module.css";

export default async function TopDonors({ donors }: { donors: Contributions }) {
  return (
    <section className={styles.donorSection}>
      <h3 className={styles.donorSectionHeader}>Top donors</h3>
      {donors.groups.length ? (
        donors.groups.map((donorGroup: ContributionsGroupType, ind: number) => (
          <ContributionsGroup key={`donor-${ind}`} donorGroup={donorGroup} />
        ))
      ) : (
        <div className={`secondary ${styles.donorRow}`}>No donors found.</div>
      )}
    </section>
  );
}
