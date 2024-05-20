import sharedStyles from "../shared.module.css";

export default function TotalSpending({
  amount,
  influenceSubject,
}: {
  amount: string;
  influenceSubject?: string;
}) {
  if (!influenceSubject) {
    influenceSubject = "2024 elections";
  }
  return (
    <div className={sharedStyles.smallCard}>
      Cryptocurrency companies and associated people have spent{" "}
      <div className={sharedStyles.highlight}>{amount}</div> to influence{" "}
      {influenceSubject}.
    </div>
  );
}
