"use client";

import { isError } from "@/app/utils/errors";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchConstant } from "../actions/fetch";
import { CommitteeConstant } from "../types/Committee";
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
      if (segments[0] === "committees") {
        const committeeDetails = await fetchConstant("committees");
        if (isError(committeeDetails)) {
          return;
        }
        setCommittees(committeeDetails);
      }
    })();
  }, [segments]);

  const getSegmentText = (
    segment: string,
    index: number,
    segments: string[],
  ): string => {
    if (segments[0] === "committees" && index === 1) {
      if (!committees || !(segment in committees)) {
        return segment;
      }
      return committees[segment].name;
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
