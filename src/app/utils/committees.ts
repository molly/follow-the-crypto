import { Committee } from "../types/Committee";
import { getConstant } from "./constants";
import { titlecase } from "./titlecase";

export async function getCommitteeNameById(
  committeeId: string,
): Promise<string | Committee | null> {
  const COMMITTEES: Record<string, Committee> | null =
    await getConstant("committees");

  if (COMMITTEES) {
    for (const committee of Object.values(COMMITTEES)) {
      if (committee.id === committeeId) {
        return committee;
      }
    }
  }

  const resp = await fetch(
    `https://api.open.fec.gov/v1/committee/${committeeId}?api_key=${process.env.FEC_API_KEY}`,
  );

  if (!resp.ok) {
    if (resp.status >= 400 && resp.status < 500) {
      return null;
    } else {
      throw new Error(
        `Something went wrong when fetching ${committeeId} committee details.`,
      );
    }
  }
  const json = await resp.json();
  return titlecase(json.results[0].name);
}
