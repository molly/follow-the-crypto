import { fetchConstant } from "@/app/actions/fetch";
import { Contribution as ContributionType } from "@/app/types/Contributions";
import { titlecaseCompany } from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";
import {
  DonorType,
  IndividualDonorType,
  getDonorDetails,
} from "../../../utils/donorDetails";
import styles from "./page.module.css";

function ContributorName({
  contribution,
  donorDetails,
}: {
  contribution: ContributionType;
  donorDetails: IndividualDonorType;
}) {
  if (contribution.redacted) {
    return <span className={styles.redactedName}>Individual</span>;
  } else if (!donorDetails.company) {
    return <span className={styles.donorCompany}>{donorDetails.name}</span>;
  } else {
    return donorDetails.name;
  }
}

function CompanyName({
  donorDetails,
  inline = false,
  contributionDate = null,
}: {
  donorDetails: DonorType;
  inline?: boolean;
  contributionDate?: JSX.Element | null;
}) {
  const companyName =
    (donorDetails.companyAlias &&
      titlecaseCompany(donorDetails.companyAlias)) ||
    donorDetails.company;

  const alias =
    donorDetails.companyAlias &&
    donorDetails.companyAlias !== donorDetails.company?.toUpperCase()
      ? donorDetails.company
      : "";

  if (inline) {
    return (
      <>
        <span>{companyName}</span>
        {alias && <span className="secondary smaller"> ({alias})</span>}
      </>
    );
  }

  return (
    <div>
      <span className={styles.donorCompany}>{companyName}</span>
      {alias && (
        <div className={styles.aliasAndDate}>
          <span className="secondary smaller">({alias})</span>{" "}
          {contributionDate}
        </div>
      )}
      {!alias && contributionDate}
    </div>
  );
}

function ContributionDate({
  contribution,
}: {
  contribution: ContributionType;
}) {
  if (
    "contribution_receipt_date" in contribution &&
    contribution.contribution_receipt_date
  ) {
    return (
      <span
        className={styles.donorDate}
      >{`${formatDateFromString(contribution.contribution_receipt_date)}`}</span>
    );
  } else if (
    "oldest" in contribution &&
    contribution.oldest &&
    "newest" in contribution &&
    contribution.newest
  ) {
    return (
      <div
        className={styles.donorDateRange}
      >{`${contribution.total} contribution${contribution.total > 1 ? "s" : ""} from ${formatDateFromString(contribution.oldest)} to ${formatDateFromString(contribution.newest)}`}</div>
    );
  }
  return null;
}

function ContributionAmount({
  contribution,
  isSubRow = false,
}: {
  contribution: ContributionType;
  isSubRow?: boolean;
}) {
  if (
    "contribution_receipt_amount" in contribution &&
    contribution.contribution_receipt_amount
  ) {
    return (
      <span className={isSubRow ? styles.subRowCurrency : ""}>
        {formatCurrency(contribution.contribution_receipt_amount)}
      </span>
    );
  } else if (
    "total_receipt_amount" in contribution &&
    contribution.total_receipt_amount
  ) {
    return (
      <span className={isSubRow ? styles.subRowCurrency : ""}>
        {formatCurrency(contribution.total_receipt_amount)}
      </span>
    );
  }
  return null;
}

export default async function Contribution({
  contribution,
  isSubRow,
}: {
  contribution: ContributionType;
  isSubRow?: boolean;
}) {
  let [COMPANY_ALIASES, INDIVIDUAL_EMPLOYERS] = await Promise.all([
    fetchConstant<Record<string, string>>("companyAliases") || {},
    fetchConstant<string[]>("individualEmployers") || [],
  ]);

  const donorDetails = getDonorDetails(
    contribution,
    COMPANY_ALIASES as Record<string, string>,
    INDIVIDUAL_EMPLOYERS as string[],
  );
  let donorIdentifier;

  if (isSubRow) {
    // SUBROW
    if (donorDetails.isIndividual) {
      donorIdentifier = (
        <>
          <ContributorName
            contribution={contribution}
            donorDetails={donorDetails}
          />
          {donorDetails.occupation && (
            <span className={styles.donorOccupation}>
              {donorDetails.occupation}
            </span>
          )}
        </>
      );
    } else {
      donorIdentifier = <CompanyName donorDetails={donorDetails} inline />;
    }

    return (
      <div className={styles.donorSubRow}>
        <div>
          {donorIdentifier}
          <ContributionDate contribution={contribution} />
        </div>
        <ContributionAmount contribution={contribution} isSubRow={true} />
      </div>
    );
  } else {
    // TOP-LEVEL ROW
    if (donorDetails.isIndividual) {
      donorIdentifier = (
        <div>
          <div>
            <ContributorName
              contribution={contribution}
              donorDetails={donorDetails}
            />
            {donorDetails.occupation && (
              <span className={styles.donorOccupation}>
                {donorDetails.occupation}
              </span>
            )}
            {!donorDetails.company && (
              <ContributionDate contribution={contribution} />
            )}
          </div>
          {donorDetails.company && (
            <div className={"oldest" in contribution ? "" : styles.donorBlock}>
              <CompanyName donorDetails={donorDetails} />
              <ContributionDate contribution={contribution} />
            </div>
          )}
        </div>
      );
    } else {
      donorIdentifier = (
        <div className={"oldest" in contribution ? "" : styles.donorBlock}>
          <CompanyName
            donorDetails={donorDetails}
            contributionDate={<ContributionDate contribution={contribution} />}
          />
        </div>
      );
    }

    return (
      <div className={styles.donorRow}>
        <div className={styles.donorSummary}>
          {donorIdentifier}
          <ContributionAmount contribution={contribution} />
        </div>
      </div>
    );
  }
}
