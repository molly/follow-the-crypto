import AllRecentExpenditures from "@/app/components/home/AllRecentExpenditures";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recent Expenditures | Follow the Crypto",
  description:
    "Recent expenditures in the 2024 election cycle by cryptocurrency-focused political action committees.",
};

export default function ExpendituresList() {
  return (
    <section className="single-column-page">
      <h1>Recent expenditures by any crypto-focused committee</h1>
      <AllRecentExpenditures fullPage={true} />
    </section>
  );
}
