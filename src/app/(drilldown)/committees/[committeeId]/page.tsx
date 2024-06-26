import {
  fetchCommitteeDetails,
  fetchCommitteeDonors,
} from "@/app/actions/fetch";
import { CommitteeDetails } from "@/app/types/Committee";
import { is4xx, isError } from "@/app/utils/errors";
import { Metadata } from "next";

import { Contributions } from "@/app/types/Contributions";
import CommitteeDetailsSection from "./CommitteeDetailsSection";
import RecentExpenditures from "./RecentExpenditures";
import TopDonors from "./TopDonors";

// TODO: Page hangs if this fetch is slow
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
  const committeeData = await fetchCommitteeDetails(params.committeeId);
  const donorData = await fetchCommitteeDonors(params.committeeId);

  if (isError(committeeData) || isError(donorData)) {
    if (is4xx(committeeData) || is4xx(donorData)) {
      return <div>Committee not found.</div>;
    } else {
      return <div>Something went wrong when fetching committee details.</div>;
    }
  }

  const committee = committeeData as CommitteeDetails;
  const donors = donorData as Contributions;

  return (
    <>
      <CommitteeDetailsSection committee={committee} donors={donors} />
      <TopDonors donors={donors} />
      <RecentExpenditures committee={committee} />
    </>
  );
}
