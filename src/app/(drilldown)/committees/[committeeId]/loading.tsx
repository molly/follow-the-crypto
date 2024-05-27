import Skeleton from "@/app/components/skeletons/Skeleton";
import sharedStyles from "@/app/shared.module.css";
import pageStyles from "./page.module.css";

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function range(n: number) {
  return Array.from({ length: n }, (x, i) => i);
}

function CardRowSkeleton() {
  return (
    <section className={pageStyles.donorSection}>
      <Skeleton
        onCard={true}
        height="1.5rem"
        width="7.5rem"
        style={{ marginLeft: "1rem" }}
      />

      {range(5).map((x) => (
        <div className={pageStyles.donorRow} key={`row-${x}`}>
          <div className={pageStyles.donorSummary}>
            <Skeleton
              onCard={true}
              height="1.2rem"
              width={`${getRandomInt(5, 10)}rem`}
            />
            <Skeleton onCard={true} height="1.2rem" width="8rem" />
          </div>
          <div className={pageStyles.contributionsContainer}>
            {range(getRandomInt(3, 8)).map((y) => (
              <div className={pageStyles.donorSubRow} key={`subrow-${x}-${y}`}>
                <Skeleton onCard={true} width={`${getRandomInt(12, 28)}rem`} />
                <Skeleton onCard={true} width={`${getRandomInt(6, 15)}rem`} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default function Loading() {
  return (
    <>
      <div className={sharedStyles.fullWidth}>
        <Skeleton height="1.5rem" width="20rem" />
        <Skeleton height="0.9em" width="50em" />
        <Skeleton height="3em" />
      </div>
      <div className={sharedStyles.smallCard}>
        <Skeleton onCard={true} height="3em" width="90%" />
        <Skeleton onCard={true} height="1em" width="7em" />
      </div>
      <CardRowSkeleton />
    </>
  );
}
