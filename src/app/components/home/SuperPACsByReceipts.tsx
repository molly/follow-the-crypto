import { fetchSuperPACsByReceipts } from "@/app/actions/fetch";
import styles from "@/app/page.module.css";
import sharedStyles from "@/app/shared.module.css";
import { AllCommitteesSummary } from "@/app/types/Committee";
import { isError } from "@/app/utils/errors";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";

function TableContents({ superPACs }: { superPACs: AllCommitteesSummary[] }) {
  let lastCryptoIndex = -1;
  for (let i = 0; i < superPACs.length; i++) {
    if (superPACs[i].is_crypto) {
      lastCryptoIndex = i;
    }
  }
  const superPACsLimited =
    lastCryptoIndex < 10 ? superPACs.slice(0, 10) : superPACs;

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
            <td>{committeeIdentifier}</td>
            <td className="secondary">{committee.description}</td>
            <td className={styles.superPacMoneyCell}>
              {formatCurrency(committee.receipts, true)}
            </td>
            <td className={styles.superPacMoneyCell}>
              {formatCurrency(committee.disbursements, true)}
            </td>
            <td className={styles.superPacMoneyCell}>
              {formatCurrency(committee.last_cash_on_hand_end_period, true)}
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default async function SuperPACsByReceipts() {
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
  } else {
    tableContents = (
      <TableContents superPACs={superPacsData as AllCommitteesSummary[]} />
    );
  }

  return (
    <div className={sharedStyles.fullWidthCard}>
      <div>
        Despite the relatively small size of the cryptocurrency industry,
        cryptocurrency-focused super PACs have raised more than almost any other
        super PAC.
        <h2>All super PACs</h2>
        <table className={styles.superPacTable}>
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Description</th>
              <th className={styles.superPacMoneyCell}>Receipts</th>
              <th className={styles.superPacMoneyCell}>Disbursements</th>
              <th className={styles.superPacMoneyCell}>Cash on hand</th>
            </tr>
          </thead>
          <tbody>{tableContents}</tbody>
        </table>
      </div>
    </div>
  );
}
