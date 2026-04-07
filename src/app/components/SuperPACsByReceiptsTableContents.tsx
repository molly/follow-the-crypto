import { fetchSuperPACsByReceipts } from "../actions/fetch";
import { Sector } from "../types/Sector";
import PACsByReceiptsTableContents from "./PACsByReceiptsTableContents";

export default async function SuperPACsByReceiptsTableContents({
  sector = "all",
}: {
  sector?: Sector;
}) {
  const data = await fetchSuperPACsByReceipts(sector);
  return <PACsByReceiptsTableContents data={data} type="super" />;
}
