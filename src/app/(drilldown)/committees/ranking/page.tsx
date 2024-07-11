import sharedStyles from "@/app/shared.module.css";
import Link from "next/link";

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
