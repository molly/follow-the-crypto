import { ErrorType } from "@/app/types/Error";
import { DonorGroup, mergeDonors } from "@/app/utils/donorDetails";
import { Committee } from "../../data/companyAliases";
import Donor from "./Donor";
import styles from "./page.module.css";

async function getCommitteeDonors(
  committee: Committee,
): Promise<DonorGroup[] | ErrorType> {
  const resp = await fetch(
    `https://api.open.fec.gov/v1/schedules/schedule_a/?committee_id=${committee.id}&per_page=100&sort=-contribution_receipt_amount&api_key=${process.env.FEC_API_KEY}`,
  );

  if (!resp.ok) {
    return { statusCode: resp.status, error: true };
  }
  const data = await resp.json();
  return mergeDonors(data);
}

export default async function TopDonors({
  committee,
}: {
  committee: Committee;
}) {
  const data = await getCommitteeDonors(committee);

  if ("error" in data) {
    if (data.statusCode && data.statusCode >= 400 && data.statusCode < 500) {
      return <div>{`Could not find donor details for ${committee.name}.`}</div>;
    } else {
      return (
        <div>{`Something went wrong when fetching ${committee.name} donor details.`}</div>
      );
    }
  }

  return (
    <section className={styles.donorSection}>
      <h3 className={styles.donorSectionHeader}>Top donors</h3>
      {data.length ? (
        data.map((donorGroup: DonorGroup, ind: number) => (
          <Donor key={`donor-${ind}`} donorGroup={donorGroup} />
        ))
      ) : (
        <div>No donors found</div>
      )}
    </section>
  );
}
