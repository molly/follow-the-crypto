import PACsByReceipts from "@/app/components/PACsByReceipts";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase } from "@/app/utils/titlecase";
import { Metadata } from "next";
import PacList from "./PacList";

export function generateMetadata({
  params,
}: {
  params: { type: string };
}): Metadata {
  return customMetadata({
    title: `${titlecase(params.type)} PAC rankings`,
    description: `The most highly funded ${params.type === "super" ? "super PACs" : "political action committees"} in the 2024 election cycle.`,
  });
}

export default async function PACRankingPage({
  params,
}: {
  params: { type: string };
}) {
  return (
    <section className="full-width">
      <h1>Committees</h1>
      <PACsByReceipts type={params.type} fullPage={true}>
        <PacList type={params.type} />
      </PACsByReceipts>
    </section>
  );
}
