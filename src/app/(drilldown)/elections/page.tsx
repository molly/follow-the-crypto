import InfluencedRaces from "@/app/components/InfluencedRaces";
import { customMetadata } from "@/app/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = customMetadata({
  title: "Influenced Elections",
  description:
    "Cryptocurrency-focused PACs have already spent heavily to influence the outcome of multiple Congressional races.",
});

export default function RacesList() {
  return (
    <div className="single-column-page">
      <h1>Elections</h1>
      <p>
        Cryptocurrency-focused PACs have already spent heavily to influence the
        outcome of multiple Congressional races.
      </p>
      <InfluencedRaces fullPage={true} />
    </div>
  );
}
