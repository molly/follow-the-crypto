import { fetchCommitteeDetails } from "@/app/actions/fetch";
import { CommitteeDetails } from "@/app/types/Committee";
import { ErrorType, is4xx, isError } from "@/app/utils/errors";
import { Metadata } from "next";

import CommitteeDetailsSection from "./CommitteeDetailsSection";
import TopDonors from "./TopDonors";

export async function generateMetadata({
  params,
}: {
  params: { committeeId: string };
}): Promise<Metadata> {
  const committee = await fetchCommitteeDetails(params.committeeId);
  if (isError(committee)) {
    return {
      title: "Follow the Crypto",
    };
  }
  return {
    title: `${(committee as CommitteeDetails).name} | Follow the Crypto`,
  };
}

export default async function CommitteePage({
  params,
}: {
  params: { committeeId: string };
}) {
  const data = await fetchCommitteeDetails(params.committeeId);

  if (isError(data)) {
    const error = data as ErrorType;
    if (is4xx(error)) {
      return <div>Committee not found.</div>;
    } else {
      return <div>Something went wrong when fetching committee details.</div>;
    }
  }

  const committee = data as CommitteeDetails;

  return (
    <>
      <CommitteeDetailsSection committee={committee} />
      <TopDonors committee={committee} />
    </>
  );
}
