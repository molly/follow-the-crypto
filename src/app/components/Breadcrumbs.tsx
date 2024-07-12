"use client";

import { isError } from "@/app/utils/errors";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchConstant } from "../actions/fetch";
import { STATES_BY_ABBR } from "../data/states";
import { CommitteeConstant } from "../types/Committee";
import { getRaceName } from "../utils/races";
import { titlecase } from "../utils/titlecase";
import styles from "./header.module.css";

export default function Breadcrumbs() {
  const [committees, setCommittees] = useState<Record<
    string,
    CommitteeConstant
  > | null>(null);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  useEffect(() => {
    (async function () {
      if (
        pathname.startsWith("/committees") &&
        !pathname.startsWith("/committees/ranking/")
      ) {
        const committeeDetails = await fetchConstant("committees");
        if (isError(committeeDetails)) {
          return;
        }
        setCommittees(committeeDetails as Record<string, CommitteeConstant>);
      }
    })();
  }, [pathname]);

  const getSegmentText = (
    segment: string,
    index: number,
    segments: string[],
  ): string => {
    if (
      segments[0].toLowerCase() === "committees" &&
      index === 1 &&
      segment.toLowerCase() !== "ranking"
    ) {
      if (!committees || !(segment.toUpperCase() in committees)) {
        return segment;
      }
      return committees[segment.toUpperCase()].name;
    } else if (segments[0].toLowerCase() === "elections" && index === 1) {
      const state = segment.split("-")[0].toUpperCase();
      return `${STATES_BY_ABBR[state]} ${getRaceName(segment.toUpperCase())} election`;
    } else if (
      (segments[0].toLowerCase() === "individuals" ||
        segments[0].toLowerCase() === "companies") &&
      index === 1
    ) {
      return titlecase(segment.toLowerCase().replaceAll("-", " "));
    } else if (index === 1 && segment.toLowerCase() === "faq") {
      return "FAQ";
    }
    return titlecase(segment);
  };

  return (
    <ul className={styles.breadcrumbsContainer}>
      <li className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
      </li>
      {segments.map((segment, index) => {
        const segmentText = getSegmentText(segment, index, segments);
        return (
          <li key={index} className={styles.breadcrumb}>
            {index === segments.length - 1 ? (
              <span>{segmentText}</span>
            ) : (
              <Link
                className={styles.breadcrumbLink}
                href={`/${segments.slice(0, index + 1).join("/")}`}
              >
                {getSegmentText(segment, index, segments)}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
