import AllRecentExpenditures from "@/app/components/home/AllRecentExpenditures";

export default function RacesList() {
  return (
    <section>
      <h1>Recent expenditures by any crypto-focused committee</h1>
      <AllRecentExpenditures fullPage={true} />
    </section>
  );
}
