import { formatCurrency } from "../../../utils/utils";

import {
  fetchCommitteeDetails,
  fetchCommitteeDonors,
} from "@/app/actions/fetch";
import MoneyCard from "@/app/components/MoneyCard";
import { CommitteeDetails } from "@/app/types/Committee";
import { Contributions } from "@/app/types/Contributions";
import { is4xx, isError } from "@/app/utils/errors";
import styles from "./page.module.css";

export default async function CommitteeRaised({
  committeeId,
}: {
  committeeId: string;
}) {
  const [committeeData, donorData] = await Promise.all([
    fetchCommitteeDetails(committeeId),
    fetchCommitteeDonors(committeeId),
  ]);

  if (isError(committeeData) || isError(donorData)) {
    if (is4xx(committeeData) || is4xx(donorData)) {
      return <div>Committee not found.</div>;
    } else {
      return <div>Something went wrong when fetching committee details.</div>;
    }
  }

  const committee = committeeData as CommitteeDetails;
  const donors = donorData as Contributions;

  const total = donors.total_contributed + donors.total_transferred;

  return (
    <MoneyCard
      amount={formatCurrency(total || 0, true)}
      topText={<span>{`${committee.name} has raised`}</span>}
      bottomText={
        donors.total_transferred > 0 ? (
          <div className={styles.raisedDetails}>
            <div>
              {`${formatCurrency(donors.total_contributed, true)} came from direct contributions.`}
            </div>
            <div>
              {`${formatCurrency(donors.total_transferred, true)} was transferred from other committees.`}
            </div>
          </div>
        ) : undefined
      }
    />
  );
}
