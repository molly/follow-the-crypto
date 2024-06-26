import { fetchRecentCommitteeExpenditures } from "@/app/actions/fetch";
import { CommitteeDetails } from "@/app/types/Committee";
import {
  Expenditure,
  RecentCommitteeExpenditures,
} from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import { getCategory } from "@/app/utils/expenditures";
import {
  titlecaseIndividualName,
  titlecaseSuffix,
} from "@/app/utils/titlecase";
import { formatCurrency, formatDateFromString } from "@/app/utils/utils";
import styles from "./page.module.css";

export default async function RecentExpenditures({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  const data = await fetchRecentCommitteeExpenditures(committee.id);
  if (isError(data)) {
    return <div>Something went wrong when fetching recent expenditures.</div>;
  }

  const committeesExpenditures = data as Record<
    string,
    RecentCommitteeExpenditures
  >;
  if (!(committee.id in committeesExpenditures)) {
    return <div>No recent expenditures found for this committee.</div>;
  }
  const recentExpenditures = committeesExpenditures[committee.id][
    "recent"
  ] as Expenditure[];

  return (
    <section className={styles.recentExpendituresSection}>
      <h3 className={styles.donorSectionHeader}>Recent expenditures</h3>
      {recentExpenditures.map((expenditure) => {
        const name = [
          expenditure.candidate_first_name,
          expenditure.candidate_middle_name,
          expenditure.candidate_last_name,
        ]
          .filter(Boolean)
          .map(titlecaseIndividualName)
          .join(" ");

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
              {expenditure.expenditure_date &&
                expenditure.dissemination_date && (
                  <span>
                    {` (disseminated ${formatDateFromString(expenditure.dissemination_date)})`}
                  </span>
                )}
            </div>
            <div className={styles.expenditureNameAndAmount}>
              <span>
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
              <span>{formatCurrency(expenditure.expenditure_amount)}</span>
            </div>
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
      })}
    </section>
  );
}
