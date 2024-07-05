import Link from "next/link";
import styles from "./recentExpenditures.module.css";
import tableStyles from "./tables.module.css";

export default function RecentExpenditures({
  children,
  fullPage,
  noHeader,
  className,
}: {
  children: React.ReactNode;
  fullPage?: boolean;
  noHeader?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`${className ? className : ""} ${tableStyles.recentExpendituresCard}`}
    >
      {!noHeader && (
        <h3 className={styles.recentExpendituresSectionHeader}>
          Recent expenditures
        </h3>
      )}
      {children}
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <Link href="/expenditures">&raquo; All recent expenditures</Link>
        </div>
      )}
    </section>
  );
}
