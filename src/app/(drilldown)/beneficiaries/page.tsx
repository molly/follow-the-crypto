import {
  fetchAllRecipients,
  fetchBeneficiaries,
  fetchBeneficiariesOrder,
} from "@/app/actions/fetch";
import ErrorText from "@/app/components/ErrorText";
import MaybeLink from "@/app/components/MaybeLink";
import tableStyles from "@/app/components/tables.module.css";
import COMMITTEES from "@/app/data/committees";
import { SINGLE_MEMBER_STATES, STATES_BY_ABBR } from "@/app/data/states";
import {
  Beneficiary,
  CandidateBeneficiary as CandidateBeneficiaryType,
  CommitteeBeneficiary as CommitteeBeneficiaryType,
} from "@/app/types/Beneficiaries";
import { RecipientDetails } from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";
import { getRaceName } from "@/app/utils/races";
import { titlecaseCommittee, titlecaseLastFirst } from "@/app/utils/titlecase";
import { formatCurrency } from "@/app/utils/utils";
import Link from "next/link";
import styles from "./page.module.css";

function CommitteeBeneficiary({
  id,
  beneficiary,
  committee,
}: {
  id: string;
  beneficiary: CommitteeBeneficiaryType;
  committee?: RecipientDetails;
}) {
  return (
    <tr className={tableStyles.beneficiariesRow}>
      <td>
        <Link
          href={id in COMMITTEES ? `/committees/${id}` : `/beneficiaries/${id}`}
        >
          {committee && committee.committee_name
            ? titlecaseCommittee(committee.committee_name)
            : id}
        </Link>
      </td>
      <td>{committee && committee.description ? committee.description : ""}</td>
      <td
        className={`center-cell ${committee && committee.party ? committee.party.toLowerCase() : ""}`}
      >
        {committee && committee.party ? committee.party[0] : ""}
      </td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

function CandidateBeneficiary({
  id,
  beneficiary,
}: {
  id: string;
  beneficiary: CandidateBeneficiaryType;
}) {
  const { state, office, district } = beneficiary.candidate_details;
  let raceId = `${office}`;
  if (office === "H" && !SINGLE_MEMBER_STATES.includes(state)) {
    raceId += `-${district}`;
  }
  let raceName;
  if (office !== "P") {
    raceName = `${STATES_BY_ABBR[state]} ${getRaceName(raceId)}`;
  } else {
    raceName = "President";
  }

  return (
    <tr className={tableStyles.beneficiariesRow}>
      <td>
        <Link href={`/beneficiaries/${id}`}>
          {titlecaseLastFirst(beneficiary.candidate_details.name)}
        </Link>
      </td>
      <td>
        <span>candidate for </span>
        <MaybeLink href={beneficiary.candidate_details.race_link}>
          {raceName}
        </MaybeLink>
      </td>
      <td
        className={`center-cell ${beneficiary.candidate_details.party.toLowerCase()}`}
      >
        {beneficiary.candidate_details.party[0]}
      </td>
      <td className="number-cell">{formatCurrency(beneficiary.total, true)}</td>
    </tr>
  );
}

export default async function BeneficiariesList() {
  const [beneficiariesData, beneficiariesOrderData, recipientCommitteesData] =
    await Promise.all([
      fetchBeneficiaries(),
      fetchBeneficiariesOrder(),
      fetchAllRecipients(),
    ]);
  if (isError(beneficiariesData) || isError(beneficiariesOrderData)) {
    return <ErrorText subject="the list of beneficiaries" />;
  }

  const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
  const beneficiariesOrder = beneficiariesOrderData as string[];
  const committees = isError(recipientCommitteesData)
    ? {}
    : (recipientCommitteesData as Record<string, RecipientDetails>);

  return (
    <div className="single-column-page">
      <section className={styles.card}>
        <h2 className={tableStyles.tableCardContent}>Beneficiaries</h2>
        <table>
          <thead>
            <tr>
              <th className="text-cell">Recipient</th>
              <th className="text-cell"></th>
              <th className="center-cell">Party</th>
              <th className="number-cell">Total</th>
            </tr>
          </thead>
          <tbody>
            {beneficiariesOrder.map((id) => {
              const beneficiary = beneficiaries[id];
              if (!beneficiary) return null;
              if (beneficiary.type === "committee") {
                return (
                  <CommitteeBeneficiary
                    id={id}
                    beneficiary={beneficiary}
                    committee={committees[id]}
                    key={id}
                  />
                );
              }
              if (!beneficiary.candidate_details) return null;
              return (
                <CandidateBeneficiary
                  id={id}
                  beneficiary={beneficiary}
                  key={id}
                />
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
