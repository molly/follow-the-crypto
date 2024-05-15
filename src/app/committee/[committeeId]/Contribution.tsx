import { ScheduleA } from "@/app/types/FECTypes";
import { currency } from "@/app/utils/utils";
import { DonorType, getDonorDetails } from "../../utils/donorDetails";
import styles from "./page.module.css";

export default function Contribution({
  contribution,
  isSubRow,
}: {
  contribution: ScheduleA;
  isSubRow?: boolean;
}) {
  const donorDetails: DonorType = getDonorDetails(contribution);
  let company, donorIdentifier;

  const renderContributionDate = (date: string | null | undefined) => {
    if (!date) {
      return null;
    } else {
      return (
        <span className={styles.donorDate}>
          {` – ${new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        </span>
      );
    }
  };

  if (isSubRow) {
    // SUBROW
    company = <span>{donorDetails.company}</span>;

    if (donorDetails.isIndividual) {
      donorIdentifier = (
        <>
          {donorDetails.name}{" "}
          {donorDetails.occupation && (
            <span className={styles.donorOccupation}>
              {donorDetails.occupation}
            </span>
          )}
        </>
      );
    } else {
      donorIdentifier = company;
    }

    return (
      <div className={styles.donorSubRow}>
        <div>
          {donorIdentifier}
          {renderContributionDate(contribution.contribution_receipt_date)}
        </div>
        {contribution.contribution_receipt_amount && (
          <span className={styles.subRowCurrency}>
            {currency(contribution.contribution_receipt_amount)}
          </span>
        )}
      </div>
    );
  } else {
    // TOP-LEVEL ROW
    company = (
      <div>
        <span className={styles.donorCompany}>
          {donorDetails.companyAlias || donorDetails.company}
        </span>
        {donorDetails.companyAlias &&
          donorDetails.companyAlias !== donorDetails.company && (
            <div className="secondary">({donorDetails.company})</div>
          )}
      </div>
    );

    if (donorDetails.isIndividual) {
      donorIdentifier = (
        <div>
          <div>
            {donorDetails.name}{" "}
            {donorDetails.occupation && (
              <span className={styles.donorOccupation}>
                {donorDetails.occupation}
              </span>
            )}
            {!donorDetails.company &&
              renderContributionDate(contribution.contribution_receipt_date)}
          </div>
          {donorDetails.company && (
            <div className={styles.tmp}>
              {company}
              {renderContributionDate(contribution.contribution_receipt_date)}
            </div>
          )}
        </div>
      );
    } else {
      donorIdentifier = (
        <div className={styles.tmp}>
          {company}
          {renderContributionDate(contribution.contribution_receipt_date)}
        </div>
      );
    }

    return (
      <div className={styles.donorRow}>
        <div className={styles.donorSummary}>
          {donorIdentifier}
          {contribution.contribution_receipt_amount && (
            <span>{currency(contribution.contribution_receipt_amount)}</span>
          )}
        </div>
      </div>
    );
  }
}
