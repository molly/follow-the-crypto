import Link from "next/link";
import tableStyles from "./tables.module.css";
import styles from "./recentExpenditures.module.css";

export default function RecentContributions({
  children,
  className,
  fullPage,
  noHeader,
}: {
  children: React.ReactNode;
  className?: string;
  fullPage?: boolean;
  noHeader?: boolean;
}) {
  return (
    <section
      className={`${className ? className : ""} ${tableStyles.recentExpendituresCard}`}
    >
      {!noHeader && (
        <h3 className={styles.recentExpendituresSectionHeader}>
          Recent contributions
        </h3>
      )}
      {children}
      {!fullPage && (
        <div className={styles.tableCardContent}>
          <Link href="/2026/contributions">
            &raquo; All recent contributions
          </Link>
        </div>
      )}
    </section>
  );
}
