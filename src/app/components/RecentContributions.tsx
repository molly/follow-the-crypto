import Link from "next/link";
import { Sector } from "../types/Sector";
import { sectorHref } from "../utils/sector";
import styles from "./recentExpenditures.module.css";
import tableStyles from "./tables.module.css";

export default function RecentContributions({
  children,
  className,
  fullPage,
  noHeader,
  sector,
}: {
  children: React.ReactNode;
  className?: string;
  fullPage?: boolean;
  noHeader?: boolean;
  sector?: Sector;
}) {
  return (
    <section
      className={`${className ? className : ""} ${tableStyles.recentExpendituresCard}`}
    >
      {!noHeader && <h2>Recent contributions</h2>}
      {children}
      {!fullPage && (
        <div className={styles.viewMoreLinks}>
          <Link href={sectorHref("/2026/contributions", sector ?? "all")} className={styles.viewMoreLink}>
            &raquo; All recent contributions
          </Link>
        </div>
      )}
    </section>
  );
}
