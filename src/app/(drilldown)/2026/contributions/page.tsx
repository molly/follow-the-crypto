import AllRecentContributions from "@/app/components/home/AllRecentContributions";
import { customMetadata } from "@/app/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = customMetadata({
  title: "Recent Contributions",
  description:
    "Recent contributions to PACs from cryptocurrency-focused companies and individuals.",
});

export default function ContributionsList() {
  return (
    <section className="single-column-page">
      <h1>Recent contributions from tracked companies and individuals</h1>
      <AllRecentContributions fullPage={true} />
    </section>
  );
}
