import PACsByReceipts from "@/app/components/PACsByReceipts";
import { customMetadata } from "@/app/utils/metadata";
import { titlecase } from "@/app/utils/titlecase";
import { Metadata } from "next";
import PacList from "./PacList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  return customMetadata({
    title: `${titlecase(type)} PAC rankings`,
    description: `The most highly funded ${type === "super" ? "super PACs" : "political action committees"} in the 2024 election cycle.`,
  });
}

export default async function PACRankingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return (
    <section className="full-width">
      <h1>Committees</h1>
      <PACsByReceipts type={type} fullPage={true}>
        <PacList type={type} />
      </PACsByReceipts>
    </section>
  );
}
