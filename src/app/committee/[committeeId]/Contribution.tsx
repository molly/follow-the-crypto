import { Contribution as ContributionType } from "@/app/types/Contributions";
import { getConstant } from "@/app/utils/constants";
import { currency } from "@/app/utils/utils";
import {
  DonorType,
  IndividualDonorType,
  getDonorDetails,
} from "../../utils/donorDetails";
import styles from "./page.module.css";

export default async function Contribution({
  contribution,
  isSubRow,
}: {
  contribution: ContributionType;
  isSubRow?: boolean;
}) {
  const COMPANY_ALIASES: Record<string, string> =
    (await getConstant("companyAliases")) || {};
  const donorDetails: DonorType = getDonorDetails(
    contribution,
    COMPANY_ALIASES,
  );
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

  const renderContributorName = (
    contribution: ContributionType,
    donorDetails: IndividualDonorType,
  ) => {
    if (contribution.redacted) {
      return <span className={styles.redactedName}>Individual</span>;
    } else {
      return donorDetails.name;
    }
  };

  if (isSubRow) {
    // SUBROW
    company = <span>{donorDetails.company}</span>;

    if (donorDetails.isIndividual) {
      donorIdentifier = (
        <>
          {renderContributorName(contribution, donorDetails)}{" "}
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
            {renderContributorName(contribution, donorDetails)}{" "}
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
