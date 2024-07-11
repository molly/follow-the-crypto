import SpendingByParty from "@/app/components/SpendingByParty";
import { CommitteeDetails } from "@/app/types/Committee";

import { fetchCommitteeDetails } from "@/app/actions/fetch";
import { is4xx, isError } from "@/app/utils/errors";

export default async function CommitteeExpendituresByParty({
  committeeId,
}: {
  committeeId: string;
}) {
  const committeeData = await fetchCommitteeDetails(committeeId);

  if (isError(committeeData)) {
    if (is4xx(committeeData)) {
      return <div>Committee not found.</div>;
    } else {
      return <div>Something went wrong when fetching committee details.</div>;
    }
  }

  const committee = committeeData as CommitteeDetails;

  const expenditures = committee.by_party;

  return expenditures ? (
    <SpendingByParty expenditures={expenditures} labelId="expenditures-label" />
  ) : (
    <p>No expenditures found.</p>
  );
}
