import Link from "next/link";
import { Sector } from "../types/Sector";
import { sectorHref } from "../utils/sector";
import styles from "./recentExpenditures.module.css";
import tableStyles from "./tables.module.css";

export default function RecentExpenditures({
  children,
  fullPage,
  noHeader,
  className,
  sector,
}: {
  children: React.ReactNode;
  fullPage?: boolean;
  noHeader?: boolean;
  className?: string;
  sector?: Sector;
}) {
  return (
    <section
      className={`${className ? className : ""} ${tableStyles.recentExpendituresCard}`}
    >
      {!noHeader && <h2>Recent PAC expenditures</h2>}
      {children}
      {!fullPage && (
        <div className={styles.viewMoreLinks}>
          <Link href={sectorHref("/2026/expenditures", sector ?? "all")} className={styles.viewMoreLink}>
            &raquo; More recent expenditures
          </Link>
        </div>
      )}
    </section>
  );
}
