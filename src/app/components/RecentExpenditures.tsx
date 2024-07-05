import styles from "./recentExpenditures.module.css";
import tableStyles from "./tables.module.css";

export default function RecentExpenditures({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`${className ? className : ""} ${tableStyles.recentExpendituresCard}`}
    >
      <h3 className={styles.recentExpendituresSectionHeader}>
        Recent expenditures
      </h3>
      {children}
    </section>
  );
}
