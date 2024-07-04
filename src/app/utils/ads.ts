import { Ad } from "@/app/types/Ads";

export function getAdDate(ad: Ad): string {
  if (ad.type === "google") {
    return ad.date_range_start;
  } else if (ad.type === "image") {
    return ad.date;
  }
  return "1970";
}
