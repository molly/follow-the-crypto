import { fetchAllStateExpenditures } from "@/app/actions/fetch";
import { Expenditures } from "@/app/types/Expenditures";
import { isError } from "@/app/utils/errors";
import ChloroplethMap from "./ChloroplethMap";

export default async function MapWrapper() {
  const data = await fetchAllStateExpenditures();
  if (isError(data)) {
    return <div>Something went wrong when getting state expenditure data.</div>;
  }
  return (
    <ChloroplethMap
      expendituresByState={data as Record<string, Expenditures>}
    />
  );
}
