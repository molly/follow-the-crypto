import sharedStyles from "../shared.module.css";

export default function MoneyCard({
  amount,
  verb,
  influenceSubject,
}: {
  amount: string;
  verb: string;
  influenceSubject?: string;
}) {
  if (!influenceSubject) {
    influenceSubject = "2024 elections";
  }
  return (
    <div className={sharedStyles.smallCard}>
      Cryptocurrency companies and associated people have {verb}
      {""}
      <div className={sharedStyles.highlight}>{amount}</div> to influence{" "}
      {influenceSubject}.
    </div>
  );
}
