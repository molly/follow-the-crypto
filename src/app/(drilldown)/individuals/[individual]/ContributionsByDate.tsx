/* eslint-disable @next/next/no-img-element */
import Contribution from "@/app/components/individualOrCompany/Contribution";
import {
  IndividualOrCompanyContribution,
  RecipientDetails,
} from "@/app/types/Contributions";
import styles from "./page.module.css";

export default function ContributionsByDate({
  contributions,
  recipients,
}: {
  contributions: IndividualOrCompanyContribution[];
  recipients: Record<string, RecipientDetails>;
}) {
  if (!contributions || !contributions.length) {
    return (
      <div className={`secondary ${styles.contributionRow}`}>
        No contributions yet.
      </div>
    );
  }
  return contributions.map((contribution, ind: number) => (
    <Contribution contribution={contribution} key={`contribution-${ind}`} />
  ));
}
