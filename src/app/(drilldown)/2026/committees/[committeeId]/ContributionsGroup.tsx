import Claimed from "@/app/components/individualOrCompany/Claimed";
import MaybeLink from "@/app/components/MaybeLink";
import { ContributionsGroup as ContributionsGroupType } from "@/app/types/Contributions";
import { IndividualDonorType, getDonorDetails } from "@/app/utils/donorDetails";
import { titlecaseCompany } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import { useMemo } from "react";
import Contribution from "./Contribution";
import styles from "./page.module.css";

export default function ContributionsGroup({
  donorGroup,
}: {
  donorGroup: ContributionsGroupType;
}) {
  const isIndividual = useMemo(
    () =>
      donorGroup.contributions.every(
        (c) =>
          c.contributor_last_name !== "" &&
          c.contributor_name === donorGroup.company,
      ),
    [donorGroup.contributions, donorGroup.company],
  );
  const isClaimed = useMemo(
    () => donorGroup.contributions.every((c) => c.claimed),
    [donorGroup.contributions],
  );

  let name: string = titlecaseCompany(donorGroup.company || "");
  if (isIndividual) {
    const donorDetails: IndividualDonorType = getDonorDetails(
      donorGroup.contributions[0],
      {},
    ) as IndividualDonorType;
    if (donorDetails.name) {
      name = donorDetails.name;
    }
  }

  if (donorGroup.contributions.length === 1) {
    const donor = donorGroup.contributions[0];
    return <Contribution contribution={donor} groupName={name} />;
  }

  return (
    <div className={styles.donorRow}>
      <div className={styles.donorSummary}>
        <span className={styles.donorCompany}>
          <MaybeLink href={donorGroup.link}>{name}</MaybeLink>
          {isClaimed && <Claimed />}
        </span>
        <span>{formatCurrency(donorGroup.total)}</span>
      </div>
      <div className={styles.contributionsContainer}>
        {donorGroup.contributions.map((donor, ind) => (
          <Contribution
            isSubRow={true}
            contribution={donor}
            groupName={name}
            key={`donor-${ind}`}
          />
        ))}
      </div>
    </div>
  );
}
