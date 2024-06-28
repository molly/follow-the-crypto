import PACsByReceipts from "@/app/components/PACsByReceipts";
import PacList from "./PacList";

export default async function PACRankingPage({
  params,
}: {
  params: { type: string };
}) {
  return (
    <section>
      <h1>Committees</h1>
      <PACsByReceipts type={params.type} fullPage={true}>
        <PacList type={params.type} />
      </PACsByReceipts>
    </section>
  );
}
