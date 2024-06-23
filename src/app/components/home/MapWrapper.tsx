import { fetchAllStateExpenditures } from "@/app/actions/fetch";
import ChloroplethMap from "./ChloroplethMap";

export default async function MapWrapper() {
  const data = await fetchAllStateExpenditures();
  return <ChloroplethMap expendituresByState={data} />;
}
