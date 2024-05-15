import { Committee } from "@/app/types/Committee";
import { getConstant } from "@/app/utils/constants";
import CommitteeDetails from "./CommitteeDetails";
import TopDonors from "./TopDonors";

export default async function CommitteePage({
  params,
}: {
  params: { committeeId: string };
}) {
  const COMMITTEES: Record<string, Committee> | null =
    await getConstant("committees");
  if (!COMMITTEES || !COMMITTEES[params.committeeId]) {
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
