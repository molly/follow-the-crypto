import {
  fetchPACsByReceipts,
  fetchSuperPACsByReceipts,
} from "@/app/actions/fetch";
import PACsByReceiptsTableContents from "@/app/components/PACsByReceiptsTableContents";
import { isError } from "@/app/utils/errors";

export default async function PacList({ type }: { type: string }) {
  let data;
  if (type === "all") {
    data = await fetchPACsByReceipts();
  } else if (type === "super") {
    data = await fetchSuperPACsByReceipts();
  } else {
    return <div>Invalid type: {type}</div>;
  }

  if (isError(data)) {
    return <div>Something went wrong when fetching PACs.</div>;
  }

  return (
    <PACsByReceiptsTableContents type={type} data={data} fullPage={true} />
  );
}
