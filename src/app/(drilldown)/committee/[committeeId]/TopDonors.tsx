import { db } from "@/app/lib/db";
import { Committee } from "@/app/types/Committee";
import { Contributions, ContributionsGroup } from "@/app/types/Contributions";
import { ErrorType } from "@/app/types/Error";
import { doc, getDoc } from "firebase/firestore";
import Donor from "./Donor";
import styles from "./page.module.css";

async function getCommitteeDonors(
  committee: Committee,
): Promise<Contributions | ErrorType> {
  try {
    const docRef = doc(db, "contributions", committee.id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as Contributions;
    } else {
      return { error: true, statusCode: 404 };
    }
  } catch (e) {
    return { error: true };
  }
}

export default async function TopDonors({
  committee,
}: {
  committee: Committee;
}) {
  const data = await getCommitteeDonors(committee);
  debugger;

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
      {data.groups.length ? (
        data.groups.map((donorGroup: ContributionsGroup, ind: number) => (
          <Donor key={`donor-${ind}`} donorGroup={donorGroup} />
        ))
      ) : (
        <div>No donors found</div>
      )}
    </section>
  );
}
