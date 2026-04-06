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
      {!noHeader && <h2>Recent PAC expenditures</h2>}
      {children}
      {!fullPage && (
        <div className={styles.viewMoreLinks}>
          <Link href="/2026/expenditures" className={styles.viewMoreLink}>
            &raquo; More recent expenditures
          </Link>
        </div>
      )}
    </section>
  );
}
