import sharedStyles from "@/app/shared.module.css";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "PAC Rankings | Follow the Crypto",
  description:
    "Rankings of the most highly funded political action committees.",
};

export default async function RankingListPage() {
  return (
    <section className="single-column-page">
      <h1 className="no-margin">Most highly funded PACs</h1>
      <ul className={sharedStyles.plainList}>
        <li className={sharedStyles.plainListItem}>
          <Link href="/committees/ranking/super">Super PACs</Link>
        </li>
        <li className={sharedStyles.plainListItem}>
          <Link href="/committees/ranking/all">All PACs</Link>
        </li>
      </ul>
    </section>
  );
}
