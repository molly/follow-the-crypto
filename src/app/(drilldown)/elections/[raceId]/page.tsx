import {
  fetchBeneficiaries,
  fetchBeneficiariesWithoutExpendituresOrder,
  fetchCandidateExpenditures,
} from "@/app/actions/fetch";
import { SINGLE_MEMBER_STATES, STATES_BY_ABBR } from "@/app/data/states";
import { Beneficiary, CandidateBeneficiary } from "@/app/types/Beneficiaries";
import { RecipientCandidateDetails } from "@/app/types/Contributions";
import { ExpendituresByCandidate } from "@/app/types/Expenditures";
import { customMetadata } from "@/app/utils/metadata";
import { getRaceName } from "@/app/utils/races";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Ads from "./Ads";
import CommitteeSpending from "./CommitteeSpending";
import Elections, { ElectionsSkeleton } from "./Elections";
import OtherSupport from "./OtherSupport";
import styles from "./page.module.css";
import { SpendingSkeleton } from "./Spending";
import SpendingCard from "./SpendingCard";

export function generateMetadata({
  params,
}: {
  params: { raceId: string };
}): Metadata {
  if (params.raceId.toUpperCase() === "PRESIDENT") {
    return customMetadata({
      title: "Presidential election",
      description:
        "Cryptocurrency industry spending to influence the United States Presidential election.",
    });
  }
  const state = params.raceId.split("-")[0];
  const raceName = `${STATES_BY_ABBR[state]} ${getRaceName(params.raceId)}`;
  return customMetadata({
    title: `${raceName} election`,
    description: `Cryptocurrency industry spending to influence the ${raceName} election.`,
  });
}

function getRaceId(candidateDetails: RecipientCandidateDetails): string {
  if (candidateDetails.office === "P") {
    return "P";
  } else if (candidateDetails.office === "S") {
    return `${candidateDetails.state}-S`;
  } else if (candidateDetails.office === "H") {
    let id = `${candidateDetails.state}-H`;
    if (!SINGLE_MEMBER_STATES.includes(candidateDetails.state)) {
      id += `-${candidateDetails.district}`;
    }
    return id;
  }
  return "";
}

export async function generateStaticParams() {
  // Influenced races
  const { order: candOrder, candidates } = (await fetchCandidateExpenditures(
    undefined,
  )) as ExpendituresByCandidate;
  const influencedIds = candOrder.map((candidateName: string) => {
    const candidate = candidates[candidateName];
    const raceId = `${candidate.state}-${candidate.race}`;
    raceId;
  });

  // Other races
  const [beneficiariesData, beneficiariesOrder] = await Promise.all([
    fetchBeneficiaries(),
    fetchBeneficiariesWithoutExpendituresOrder(),
  ]);
  const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
  const order = beneficiariesOrder as string[];
  const otherIds = order
    .filter(
      (id) =>
        !id.startsWith("C") &&
        (beneficiaries[id] as CandidateBeneficiary).candidate_details
          .isRunningThisCycle,
    )
    .map((id) => {
      const beneficiary = beneficiaries[id] as CandidateBeneficiary;
      const candidateDetails = beneficiary.candidate_details;
      const raceId = getRaceId(candidateDetails);
      return raceId === "P" ? "president" : raceId;
    });

  const uniqueIds = new Set([...influencedIds, ...otherIds]);
  return Array.from(uniqueIds).map((raceId) => ({ raceId }));
}

export default function RacePage({ params }: { params: { raceId: string } }) {
  const raceIdSplit = params.raceId.split("-");
  const stateAbbr = raceIdSplit[0];
  const isPres = params.raceId.toUpperCase() === "PRESIDENT";

  return (
    <>
      <div className={styles.columns}>
        <div className={styles.headerWrapper}>
          <h1 className="no-margin">{`${isPres ? "" : `${STATES_BY_ABBR[stateAbbr]} `}${getRaceName(params.raceId)} election`}</h1>
          {!isPres && (
            <Link
              href={`/states/${STATES_BY_ABBR[stateAbbr].replaceAll(" ", "-").toLowerCase()}`}
            >
              &raquo; Other elections in {STATES_BY_ABBR[stateAbbr]}
            </Link>
          )}
        </div>
        <div className={styles.electionsColumn}>
          <h2 className={styles.electionsColumnHeader}>Elections</h2>
          <Suspense fallback={<ElectionsSkeleton />}>
            <Elections raceId={params.raceId} />
          </Suspense>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.spendingCard}>
            <h2 id="spending-label">Money involved in this election</h2>
            <Suspense fallback={<SpendingSkeleton />}>
              <SpendingCard raceId={params.raceId} />
            </Suspense>
          </div>
          <div className={styles.committeeCard}>
            <h2>Spending by cryptocurrency-focused committees</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <CommitteeSpending raceId={params.raceId} />
            </Suspense>
          </div>
          <div className={styles.otherSupportCard}>
            <p>
              Cryptocurrency-related companies or individuals associated with
              the industry have also supported candidates in this race more
              directly, without going through the cryptocurrency-focused PACs.
            </p>
            <h2>Other spending from the industry</h2>
            <Suspense fallback={<div>Loading...</div>}>
              <OtherSupport raceId={params.raceId} />
            </Suspense>
          </div>
          <div className={styles.adsCard}>
            <h2 className="no-margin">Ads</h2>
            <Ads raceId={params.raceId} />
            <div className="secondary small">
              These are mostly tracked by hand, and so some advertisements may
              be missing. Have you seen a cryptocurrency PAC-funded
              advertisement pertaining to this election?{" "}
              <Link href="/about/contact">Send it in!</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
