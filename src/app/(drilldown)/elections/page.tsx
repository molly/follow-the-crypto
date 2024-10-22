import InfluencedRaces from "@/app/components/InfluencedRaces";
import { customMetadata } from "@/app/utils/metadata";
import type { Metadata } from "next";
import OtherSupportedRaces from "./OtherSupportedRaces";
import styles from "./page.module.css";

export const metadata: Metadata = customMetadata({
  title: "Influenced Elections",
  description:
    "Cryptocurrency-focused PACs have already spent heavily to influence the outcome of multiple Congressional races.",
});

export default function RacesList() {
  return (
    <div className={styles.page}>
      <h1 className="no-margin">Elections</h1>
      <InfluencedRaces fullPage={true} />
      <OtherSupportedRaces />
    </div>
  );
}
