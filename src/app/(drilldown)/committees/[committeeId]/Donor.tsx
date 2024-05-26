import { ContributionsGroup } from "@/app/types/Contributions";
import { titlecaseCompany } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import {
  IndividualDonorType,
  getDonorDetails,
} from "../../../utils/donorDetails";
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
  const isIndividual = donorGroup.contributions.every(
    (c) => c.contributor_name === donorGroup.company,
  );
  let name = titlecaseCompany(donorGroup.company || "");
  if (isIndividual) {
    const donorDetails: IndividualDonorType = getDonorDetails(
      donorGroup.contributions[0],
      {},
    ) as IndividualDonorType;
    name = donorDetails.name;
  }
  return (
    <div className={styles.donorRow}>
      <div className={styles.donorSummary}>
        <span className={styles.donorCompany}>{name}</span>
        <span>{formatCurrency(donorGroup.total)}</span>
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
