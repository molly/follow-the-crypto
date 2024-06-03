import { Expenditures } from "@/app/types/Expenditures";
import { sortRaces } from "@/app/utils/races";
import { formatCurrency } from "@/app/utils/utils";

import { FloatingContext, FloatingFocusManager } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, useMemo } from "react";
import styles from "./chloroplethMap.module.css";

function ChloroplethTooltip(
  props: {
    state?: string;
    expenditures?: Expenditures;
    floatingStyles: React.CSSProperties;
    context: FloatingContext;
    setHoveredState: (state: object | null) => void;
  } & Record<string, unknown>,
  ref: React.Ref<HTMLDivElement>,
) {
  const {
    state,
    expenditures,
    setIsOpen,
    isOpen,
    floatingStyles,
    context,
    setHoveredState,
    ...rest
  } = props;
  const router = useRouter();

  const races = useMemo(() => {
    if (expenditures) {
      return Object.keys(expenditures.by_race).sort(sortRaces);
    } else {
      return [];
    }
  }, [expenditures]);

  const variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delay: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {state && expenditures && (
        <FloatingFocusManager context={context} modal={false}>
          <motion.div
            className={styles.tooltip}
            ref={ref}
            style={floatingStyles}
            key={`${state}-tooltip`}
            {...rest}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3>
              <Link
                href={`/states/${state.toLocaleLowerCase().split(" ").join("-")}`}
              >
                {state}
              </Link>
            </h3>
            <table className="condensed">
              <tbody>
                <tr>
                  <td className={styles.tooltipTableName}>
                    <b>Total spending</b>
                  </td>
                  <td className={styles.tooltipTableSpending}>
                    <b>{formatCurrency(expenditures?.total, true)}</b>
                  </td>
                </tr>
                {races.map((k) => {
                  const race = expenditures.by_race[k];
                  if (race.details.candidate_office === "S") {
                    return (
                      <tr
                        key={k}
                        className={styles.tooltipTableRaceRow}
                        onClick={() => router.push(`/races/${k}`)}
                      >
                        <td className={styles.tooltipTableName}>Senate</td>
                        <td className={styles.tooltipTableSpending}>
                          {formatCurrency(race.total, true)}
                        </td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        key={k}
                        className={styles.tooltipTableRaceRow}
                        onClick={() => router.push(`/races/${k}`)}
                      >
                        <td className={styles.tooltipTableName}>
                          House District{" "}
                          {parseInt(race.details.candidate_office_district, 10)}
                        </td>
                        <td className={styles.tooltipTableSpending}>
                          {formatCurrency(race.total, true)}
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </motion.div>
        </FloatingFocusManager>
      )}
    </AnimatePresence>
  );
}

export default forwardRef(ChloroplethTooltip);
