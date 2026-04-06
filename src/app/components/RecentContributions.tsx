import Link from "next/link";
import styles from "./recentExpenditures.module.css";
import tableStyles from "./tables.module.css";

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
      {!noHeader && <h2>Recent contributions</h2>}
      {children}
      {!fullPage && (
        <div className={styles.viewMoreLinks}>
          <Link href="/2026/contributions" className={styles.viewMoreLink}>
            &raquo; All recent contributions
          </Link>
        </div>
      )}
    </section>
  );
}
