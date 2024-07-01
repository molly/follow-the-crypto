import { CommitteeConstant } from "@/app/types/Committee";
import { Expenditure } from "@/app/types/Expenditures";
import { getCategory } from "@/app/utils/expenditures";
import { range } from "@/app/utils/range";
import {
  titlecaseIndividualName,
  titlecaseSuffix,
} from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";
import Link from "next/link";
import { STATES_BY_ABBR } from "../data/states";
import { getRaceName } from "../utils/races";
import styles from "./recentExpenditures.module.css";
import Skeleton from "./skeletons/Skeleton";

export function RecentExpendituresContentSkeleton() {
  return range(20).map((i) => (
    <div
      className={styles.recentExpenditureRow}
      key={`recent-expenditures-skeleton-row-${i}`}
    >
      <div>
        <Skeleton width="18rem" onCard={true} />
      </div>
      <div className={styles.expenditureNameAndAmount}>
        <Skeleton randWidth={[10, 20]} onCard={true} />
        <Skeleton width="6rem" onCard={true} />
      </div>
      <Skeleton width="15rem" onCard={true} />
      <Skeleton width="25rem" height="0.8rem" onCard={true} />
    </div>
  ));
}

function getRaceId(expenditure: Expenditure, withState = false) {
  let raceId = "";
  if (withState) {
    raceId = `${expenditure.candidate_office_state}-${expenditure.candidate_office}`;
  } else if (expenditure.candidate_office) {
    raceId = expenditure.candidate_office;
  }
  if (
    expenditure.candidate_office_district &&
    expenditure.candidate_office_district !== "00"
  ) {
    raceId += `-${expenditure.candidate_office_district}`;
  }
  return raceId;
}

export default function RecentExpendituresContent({
  expenditures,
  committees,
}: {
  expenditures: Expenditure[];
  committees?: Record<string, CommitteeConstant>;
}) {
  return expenditures.map((expenditure) => {
    let name;
    if ("candidate_last_name" in expenditure) {
      name = [
        expenditure.candidate_first_name,
        expenditure.candidate_middle_name,
        expenditure.candidate_last_name,
      ];
    } else {
      // Efiled expenditures have a different format
      name = [
        expenditure.candidate_first_name,
        expenditure.candidate_name,
        expenditure.candidate_suffix,
      ];
    }
    name = name.filter(Boolean).map(titlecaseIndividualName).join(" ");

    return (
      <div
        key={expenditure.transaction_id}
        className={styles.recentExpenditureRow}
      >
        <div>
          {expenditure.expenditure_date &&
            formatDateFromString(expenditure.expenditure_date)}
          {!expenditure.expenditure_date &&
            expenditure.dissemination_date &&
            formatDateFromString(expenditure.dissemination_date)}
          {expenditure.expenditure_date && expenditure.dissemination_date && (
            <span>
              {` (disseminated ${formatDateFromString(expenditure.dissemination_date)})`}
            </span>
          )}
        </div>
        <div className={styles.expenditureNameAndAmount}>
          <span className={styles.expenditureTarget}>
            <span className="bold">
              {`${
                expenditure.support_oppose_indicator === "S"
                  ? "Support "
                  : "Oppose "
              } ${name}
                ${
                  expenditure.candidate_suffix
                    ? ` ${titlecaseSuffix(expenditure.candidate_suffix)}`
                    : ""
                }`}
            </span>
            {expenditure.candidate_office_state && (
              <span className="no-wrap">
                (
                <Link
                  href={`/races/${getRaceId(expenditure, true)}`}
                >{`${STATES_BY_ABBR[expenditure.candidate_office_state]} ${getRaceName(
                  getRaceId(expenditure),
                )}`}</Link>
                )
              </span>
            )}
          </span>
          <span className="bold">
            {formatCurrency(expenditure.expenditure_amount)}
          </span>
        </div>
        {committees && expenditure.committee_id && (
          <Link href={`/committees/${expenditure.committee_id}`}>
            {committees[expenditure.committee_id].name}
          </Link>
        )}
        {expenditure.category_code && (
          <div>{getCategory(expenditure.category_code)}</div>
        )}
        {expenditure.expenditure_description && (
          <div className={styles.expenditureDescription}>
            {expenditure.expenditure_description}
          </div>
        )}
      </div>
    );
  });
}
