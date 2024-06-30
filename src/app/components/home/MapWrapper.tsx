import { fetchMapData } from "@/app/actions/fetch";
import ChloroplethMap from "./ChloroplethMap";

export default async function MapWrapper() {
  const data = await fetchMapData();
  return <ChloroplethMap mapData={data} />;
}
