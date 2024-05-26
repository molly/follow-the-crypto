import { fetchCommitteeDonors } from "@/app/actions/fetch";
import { CommitteeDetails } from "@/app/types/Committee";
import { Contributions, ContributionsGroup } from "@/app/types/Contributions";
import { ErrorType, is4xx, isError } from "@/app/utils/errors";
import Donor from "./Donor";
import styles from "./page.module.css";

export default async function TopDonors({
  committee,
}: {
  committee: CommitteeDetails;
}) {
  const data = await fetchCommitteeDonors(committee.id);

  if (isError(data)) {
    const error = data as ErrorType;
    if (is4xx(error)) {
      return <div>{`Could not find donor details for ${committee.name}.`}</div>;
    } else {
      return (
        <div>{`Something went wrong when fetching ${committee.name} donor details.`}</div>
      );
    }
  }

  const donors = data as Contributions;

  return (
    <section className={styles.donorSection}>
      <h3 className={styles.donorSectionHeader}>Top donors</h3>
      {donors.groups.length ? (
        donors.groups.map((donorGroup: ContributionsGroup, ind: number) => (
          <Donor key={`donor-${ind}`} donorGroup={donorGroup} />
        ))
      ) : (
        <div>No donors found</div>
      )}
    </section>
  );
}
