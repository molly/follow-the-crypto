import { COMMITTEES } from "../../data/committees";
import CommitteeDetails from "./CommitteeDetails";
import TopDonors from "./TopDonors";

export default function CommitteePage({
  params,
}: {
  params: { committeeId: string };
}) {
  if (!COMMITTEES[params.committeeId]) {
    return <div>Committee not found</div>;
  }
  const committee = COMMITTEES[params.committeeId];

  return (
    <>
      <h1>{committee.name}</h1>
      <CommitteeDetails committee={committee} />
      <TopDonors committee={committee} />
    </>
  );
}
