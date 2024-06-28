import OverflowSection from "./OverflowSection";
import styles from "./recentExpenditures.module.css";
import tableStyles from "./tables.module.css";

export default function RecentExpenditures({
  children,
  className,
  expendituresClassName,
}: {
  children: React.ReactNode;
  className?: string;
  expendituresClassName?: string;
}) {
  return (
    <section
      className={`${className ? className : ""} ${tableStyles.recentExpendituresCard}`}
    >
      <h3 className={styles.recentExpendituresSectionHeader}>
        Recent expenditures
      </h3>
      <OverflowSection fullPage={false}>{children}</OverflowSection>
    </section>
  );
}
