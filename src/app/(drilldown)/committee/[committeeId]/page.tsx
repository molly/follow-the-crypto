import { Committee } from "@/app/types/Committee";
import { getConstant } from "@/app/utils/constants";
import type { Metadata } from "next";
import CommitteeDetails from "./CommitteeDetails";
import TopDonors from "./TopDonors";

export async function generateMetadata({
  params,
}: {
  params: { committeeId: string };
}): Promise<Metadata> {
  const COMMITTEES: Record<string, Committee> | null =
    await getConstant("committees");
  if (!COMMITTEES || !COMMITTEES[params.committeeId]) {
    return {
      title: "Follow the Crypto",
    };
  }
  const committeeName = COMMITTEES[params.committeeId].name;
  return {
    title: `${committeeName} | Follow the Crypto`,
  };
}

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
      <CommitteeDetails committee={committee} />
      <TopDonors committee={committee} />
    </>
  );
}
