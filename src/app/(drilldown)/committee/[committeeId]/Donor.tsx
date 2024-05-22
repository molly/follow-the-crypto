import { ContributionsGroup } from "@/app/types/Contributions";
import { titlecaseCompany } from "@/app/utils/titlecase";
import { currency } from "@/app/utils/utils";
import Contribution from "./Contribution";
import styles from "./page.module.css";

export default function Donor({
  donorGroup,
}: {
  donorGroup: ContributionsGroup;
}) {
  if (donorGroup.contributions.length === 1) {
    const donor = donorGroup.contributions[0];
    return <Contribution contribution={donor} />;
  }
  return (
    <div className={styles.donorRow}>
      <div className={styles.donorSummary}>
        <span className={styles.donorCompany}>
          {titlecaseCompany(donorGroup.company || "")}
        </span>
        <span>{currency(donorGroup.total)}</span>
      </div>
      <div className={styles.contributionsContainer}>
        {donorGroup.contributions.map((donor, ind) => (
          <Contribution
            isSubRow={true}
            contribution={donor}
            key={`donor-${ind}`}
          />
        ))}
      </div>
    </div>
  );
}