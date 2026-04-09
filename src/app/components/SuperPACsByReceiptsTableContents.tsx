import { fetchSuperPACsByReceipts } from "../actions/fetch";
import PACsByReceiptsTableContents from "./PACsByReceiptsTableContents";

export default async function SuperPACsByReceiptsTableContents() {
  const data = await fetchSuperPACsByReceipts();
  return <PACsByReceiptsTableContents data={data} type="super" />;
}
