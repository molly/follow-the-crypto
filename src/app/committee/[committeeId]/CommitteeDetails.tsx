import { notFound } from "next/navigation";
import { currency } from "../../utils/utils";

import { CommitteeTotals } from "@/app/types/FECTypes";
import { Committee } from "../../data";
import styles from "./page.module.css";

async function getCommitteeData(
  committee: Committee,
): Promise<CommitteeTotals | null> {
  const resp = await fetch(
    `https://api.open.fec.gov/v1/committee/${committee.id}/totals?cycle=2024&api_key=${process.env.FEC_API_KEY}`,
  );

  if (!resp.ok) {
    console.log(resp);
    if (resp.status >= 400 && resp.status < 500) {
      return null;
    } else {
      throw new Error(
        `Something went wrong when fetching ${committee.name} committee details.`,
      );
    }
  }
  const json = await resp.json();
  return json.results[0];
}

export default async function CommitteeDetails({
  committee,
}: {
  committee: Committee;
}) {
  const data = await getCommitteeData(committee);
  if (!data) {
    notFound();
  }
  return (
    <>
      <section>
        <span className="secondary">{data.committee_type_full}</span>
      </section>

      <section className={styles.receiptsSection}>
        <h2 className={styles.receipts}>
          {data.receipts ? currency(data.receipts, true) : ""}
        </h2>
        <span>raised this cyle</span>
      </section>
    </>
  );
}
