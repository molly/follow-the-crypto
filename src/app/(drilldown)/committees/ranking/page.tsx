import sharedStyles from "@/app/shared.module.css";
import Link from "next/link";

export default async function RankingListPage() {
  return (
    <section>
      <h1>Most highly funded PACs</h1>
      <ul className={sharedStyles.plainList}>
        <li className={sharedStyles.plainListItem}>
          <Link href={`/committees/ranking/all`}>Super PACs</Link>
        </li>
        <li className={sharedStyles.plainListItem}>
          <Link href={`/committees/ranking/all`}>All PACs</Link>
        </li>
      </ul>
    </section>
  );
}
