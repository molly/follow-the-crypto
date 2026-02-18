"use client";

import { isError } from "@/app/utils/errors";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchConstant } from "../actions/fetch";
import { STATES_BY_ABBR } from "../data/states";
import { CommitteeConstant } from "../types/Committee";
import { formatCompanyName } from "../utils/names";
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

  const yearOffset = segments[0] === "2026" ? 1 : 0;

  useEffect(() => {
    (async function () {
      const routeBase = segments[yearOffset]?.toLowerCase();
      if (
        routeBase === "committees" &&
        !pathname.includes("/committees/ranking/")
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
    const offset = segments[0] === "2026" ? 1 : 0;
    const routeBase = segments[offset]?.toLowerCase();
    const detailIndex = 1 + offset;
    if (
      routeBase === "committees" &&
      index === detailIndex &&
      segment.toLowerCase() !== "ranking"
    ) {
      if (!committees || !(segment.toUpperCase() in committees)) {
        return segment;
      }
      return committees[segment.toUpperCase()].name;
    } else if (routeBase === "elections" && index === detailIndex) {
      if (segment.toUpperCase() === "PRESIDENT") {
        return "President";
      }
      const state = segment.split("-")[0].toUpperCase();
      return `${STATES_BY_ABBR[state]} ${getRaceName(segment.toUpperCase())} election`;
    } else if (routeBase === "individuals" && index === detailIndex) {
      return titlecase(segment.toLowerCase().replaceAll("-", " "));
    } else if (routeBase === "companies" && index === detailIndex) {
      return formatCompanyName(
        titlecase(segment.toLowerCase().replaceAll("-", " ")),
      );
    } else if (index === detailIndex && segment.toLowerCase() === "faq") {
      return "FAQ";
    } else if (index === offset && segment.toLowerCase() === "quidproquo") {
      return "Quid pro quo";
    }
    return titlecase(segment);
  };

  let segmentsToRender = segments;
  if (segments[0] === "2026") {
    segmentsToRender = segments.slice(1);
  }

  return (
    <ul className={styles.breadcrumbsContainer}>
      <li className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
      </li>
      {segmentsToRender.map((segment, index) => {
        const segmentText = getSegmentText(segment, index, segmentsToRender);
        return (
          <li key={index} className={styles.breadcrumb}>
            {index === segmentsToRender.length - 1 ? (
              <span>{segmentText}</span>
            ) : (
              <Link
                className={styles.breadcrumbLink}
                href={`/${segmentsToRender.slice(0, index + 1).join("/")}`}
              >
                {getSegmentText(segment, index, segmentsToRender)}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}
