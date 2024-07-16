import sharedStyles from "../shared.module.css";
import Skeleton from "./skeletons/Skeleton";

export function MoneyCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={`${sharedStyles.smallCard} ${className || ""}`}>
      <Skeleton width="100%" onCard={true} />
      <Skeleton width="80%" onCard={true} style={{ margin: "0 auto" }} />
      <Skeleton
        width="90%"
        height="3rem"
        onCard={true}
        style={{ margin: "1.5rem auto" }}
      />
      <Skeleton width="80%" onCard={true} style={{ margin: "0 auto" }} />
    </div>
  );
}

export default function MoneyCard({
  amount,
  topText,
  bottomText,
  tooltip,
  className,
}: {
  amount: string | JSX.Element;
  topText: string | JSX.Element;
  bottomText?: string | JSX.Element;
  tooltip?: JSX.Element;
  className?: string;
}) {
  return (
    <div className={`${sharedStyles.smallCard} ${className || ""}`}>
      {topText} <div className={sharedStyles.highlight}>{amount}</div>{" "}
      <div>
        {bottomText}
        {tooltip}
      </div>
    </div>
  );
}
