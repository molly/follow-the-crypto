import styles from "@/app/components/tables.module.css";
import { AllCommitteesSummary } from "@/app/types/Committee";
import { ErrorType, isError } from "@/app/utils/errors";
import { titlecaseCommittee } from "@/app/utils/titlecase";
import Link from "next/link";
import ErrorText from "./ErrorText";

export default async function PACsByReceiptsTableContents({
  data,
  type,
  fullPage = false,
}: {
  data: AllCommitteesSummary[] | ErrorType;
  type: string;
  fullPage?: boolean;
}) {
  if (isError(data)) {
    return (
      <tr className={styles.superPacErrorRow}>
        <td colSpan={6}>
          <ErrorText subject={`the list of ${type} PACs`} />
        </td>
      </tr>
    );
  }

  const PACs = data as AllCommitteesSummary[];
  let PACsToShow;

  if (fullPage) {
    PACsToShow = PACs;
  } else {
    let firstCryptoIndex = -1;
    let lastCryptoIndex = -1;
    for (let i = 0; i < PACs.length; i++) {
      if (PACs[i].is_crypto) {
        if (firstCryptoIndex === -1) {
          firstCryptoIndex = i;
        }
        lastCryptoIndex = i;
      }
    }

    // Don't show a bunch of extra rows if they're all unrelated PACs
    let limit = Math.ceil(lastCryptoIndex / 10) * 10;
    if (!fullPage) {
      limit = Math.ceil(Math.max(firstCryptoIndex / 10, 1)) * 10;
    }
    limit = Math.max(limit, 20);
    PACsToShow = PACs.slice(0, limit);
  }

  return (
    <>
      {PACsToShow.map((committee, ind) => {
        const committeeName = committee.committee_name
          ? titlecaseCommittee(committee.committee_name)
          : "";
        let committeeIdentifier: string | React.ReactElement = committeeName;
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
            {type === "all" && (
              <td className={`text-cell ${styles.tableCellCollapse1}`}>
                <span className="no-wrap">
                  {committee.committee_type_full?.split(" (")[0].split(" -")[0]}
                </span>
              </td>
            )}
          </tr>
        );
      })}
    </>
  );
}
