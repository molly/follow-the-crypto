import { fetchSuperPACsByReceipts } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import { AllCommitteesSummary } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";

export default async function TableContents() {
  const superPacsData = await fetchSuperPACsByReceipts();
  let tableContents;
  if (isError(superPacsData)) {
    tableContents = (
      <tr className={styles.superPacRow}>
        <td colSpan={5}>
          Something went wrong when loading the list of super PACs.
        </td>
      </tr>
    );
  }

  const superPACs = superPacsData as AllCommitteesSummary[];

  let lastCryptoIndex = -1;
  for (let i = superPACs.length - 1; i >= 0; i--) {
    if (superPACs[i].is_crypto) {
      lastCryptoIndex = i;
      break;
    }
  }

  // Don't show a bunch of extra rows if they're all unrelated PACs
  const limit = Math.ceil(lastCryptoIndex / 10) * 10;
  const superPACsLimited = superPACs.slice(0, limit);

  return (
    <>
      {superPACsLimited.map((committee, ind) => {
        const committeeName = committee.committee_name
          ? titlecaseCommittee(committee.committee_name)
          : "";
        let committeeIdentifier: string | JSX.Element = committeeName;
        if (committee.is_crypto) {
          committeeIdentifier = (
            <Link href={`/committees/${committee.committee_id}`}>
              <b>{committeeName}</b>
            </Link>
          );
        }
        return (
          <tr
            key={committee.committee_id}
            className={
              committee.is_crypto
                ? styles.superPacCryptoRow
                : styles.superPacRow
            }
          >
            <td>{ind + 1}</td>
            <td className="text-cell">{committeeIdentifier}</td>
            <td className={`text-cell ${styles.tableCellCollapse1}`}>
              {committee.description}
            </td>
            <td className="number-cell">
              {formatCurrency(committee.receipts, true)}
            </td>
            <td className={`number-cell ${styles.tableCellCollapse2}`}>
              {formatCurrency(committee.disbursements, true)}
            </td>
            <td className={`number-cell ${styles.tableCellCollapse2}`}>
              {formatCurrency(committee.last_cash_on_hand_end_period, true)}
            </td>
          </tr>
        );
      })}
    </>
  );
}
