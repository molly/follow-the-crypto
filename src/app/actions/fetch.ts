"use cache";
import { db } from "@/app/lib/db";
import {
  AllCommitteesSummary,
  CommitteeConstant,
  CommitteeConstantWithContributions,
  CommitteeDetails,
  TotalsForCommittees,
} from "@/app/types/Committee";
import { Contributions, RecipientDetails } from "@/app/types/Contributions";
import { getAdDate } from "@/app/utils/ads";
import { ErrorType, isError } from "@/app/utils/errors";
import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Ad, AdGroup } from "../types/Ads";
import { Beneficiary } from "../types/Beneficiaries";
import { Company, CompanyTotals } from "../types/Companies";
import {
  ElectionGroup,
  ElectionsByState,
  OppositionConstant,
} from "../types/Elections";
import {
  CommitteeTotalExpenditures,
  Expenditure,
  ExpenditureCandidateSummary,
  ExpenditureId,
  ExpendituresByCandidate,
  ExpendituresByParty,
  PopulatedStateExpenditures,
  RecentExpenditures,
  StateExpenditures,
} from "../types/Expenditures";
import { IndividualContributions } from "../types/Individuals";
import { MapData } from "../types/MapData";
import { cacheTag } from "next/cache";
import { hydrateStateExpenditures } from "./hydrate";

const fetchSnapshot = async (
  path: string,
  ...pathSegments: string[]
): Promise<any | ErrorType> => {
  try {
    const docRef = doc(db, path, ...pathSegments);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      return { error: true, statusCode: 404 };
    }
  } catch (e) {
    return { error: true };
  }
};

const fetchCollection = async (
  collectionName: string,
): Promise<DocumentData | ErrorType> => {
  const docRef = collection(db, collectionName);
  const snapshot = await getDocs(docRef);
  // TODO: Better error checking when I'm not on a plane; this doesn't throw.
  if (snapshot.docs.length === 0) {
    return { error: true };
  }
  return snapshot.docs;
};

export const fetchConstant = async <T>(key: string): Promise<T | null> => {
  cacheTag("all");
  const docRef = doc(db, "constants", key);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    if (key === "individualEmployers" && "individualEmployers" in data) {
      return data.individualEmployers as T;
    }
    return data as T;
  } else {
    return null;
  }
};

// ----------------------------------------------------------------------
// TOTALS ---------------------------------------------------------------
export const fetchCommitteeTotalReceipts = async (): Promise<
  TotalsForCommittees | ErrorType
> => {
  cacheTag("all");
  const snapshot = await fetchSnapshot("totals", "committees");
  if (isError(snapshot)) {
    return snapshot as ErrorType;
  } else {
    return snapshot as TotalsForCommittees;
  }
};

export const fetchAllCommitteeTotalExpenditures =
  async (): Promise<number | ErrorType> => {
    cacheTag("all");
    const snapshot = await fetchSnapshot("expenditures", "total");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    } else {
      return snapshot.all;
    }
  };

export const fetchAllCommitteeExpenditures = async (): Promise<
  Record<string, number> | ErrorType
> => {
  cacheTag("all");
  const snapshot = await fetchSnapshot("expenditures", "total");
  if (isError(snapshot)) {
    return snapshot as ErrorType;
  } else {
    return snapshot.by_committee;
  }
};

export const fetchCommitteeTotalExpenditures = async (
  committeeId: string,
): Promise<CommitteeTotalExpenditures | ErrorType> => {
  cacheTag("all");
  const [expendituresSnapshot, committeeSnapshot] = await Promise.all([
    fetchSnapshot("expenditures", "total"),
    fetchSnapshot("committees", committeeId),
  ]);
  if (isError(expendituresSnapshot)) {
    return expendituresSnapshot as ErrorType;
  } else if (isError(committeeSnapshot)) {
    return committeeSnapshot as ErrorType;
  }
  const committee = committeeSnapshot as CommitteeDetails;
  const result: CommitteeTotalExpenditures = {
    expenditures: null,
    disbursements: null,
  };
  if (committeeId in expendituresSnapshot.by_committee) {
    result.expenditures = expendituresSnapshot.by_committee[committeeId];
  }
  if ("disbursements_by_committee" in committeeSnapshot) {
    result.disbursements = Object.values(
      committee.disbursements_by_committee,
    ).reduce((acc, disbursementGroup) => acc + disbursementGroup.total, 0);
  }
  return result;
};

export const fetchCompanyTotalSpending = async (): Promise<
  CompanyTotals | ErrorType
> => {
  cacheTag("all");
  const snapshot = await fetchSnapshot("totals", "companies");
  if (isError(snapshot)) {
    return snapshot as ErrorType;
  } else {
    return snapshot as CompanyTotals;
  }
};

// ALL COMMITTEES -------------------------------------------------------
export const fetchPACsByReceipts = async (): Promise<
  AllCommitteesSummary[] | ErrorType
> => {
  cacheTag("all");
  const data = await fetchSnapshot("allCommittees", "allPacs");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    return data.by_receipts as AllCommitteesSummary[];
  }
};

export const fetchSuperPACsByReceipts = async (): Promise<
  AllCommitteesSummary[] | ErrorType
> => {
  cacheTag("all");
  const data = await fetchSnapshot("allCommittees", "superPacs");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    return data.by_receipts as AllCommitteesSummary[];
  }
};

// COMMITTEES -----------------------------------------------------------

// Fetch all committees and sort them by total receipts
export const fetchCommitteesWithContributions = async (): Promise<
  CommitteeConstantWithContributions[] | ErrorType
> => {
  cacheTag("all");
  const [contributionsData, committeesData, committeeConstants] =
    await Promise.all([
      fetchCollection("contributions"),
      fetchCollection("committees"),
      fetchConstant<Record<string, CommitteeConstant>>("committees"),
    ]);
  if (isError(contributionsData)) {
    return contributionsData as ErrorType;
  } else if (isError(committeesData)) {
    return committeesData as ErrorType;
  } else if (!committeeConstants) {
    return {
      error: true,
      message: "Committee constants not found",
    } as ErrorType;
  } else {
    const contributions = contributionsData as DocumentData[];
    const committeesDocData = committeesData as DocumentData[];
    const committees: Record<string, CommitteeDetails> = {};
    committeesDocData.forEach((doc) => {
      committees[doc.id] = doc.data() as CommitteeDetails;
    });
    const contributionsCommittees = contributions.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as (Contributions & { id: string })[];

    const committeesWithTotals = contributionsCommittees
      .map((committee) => ({
        ...committeeConstants[committee.id],
        total_contributed: committee.total_contributed || 0,
        total_transferred: committee.total_transferred || 0,
        last_cash_on_hand_end_period:
          committees[committee.id]?.last_cash_on_hand_end_period || 0,
        total:
          (committee.total_contributed || 0) +
          (committee.total_transferred || 0) +
          (committees[committee.id]?.last_cash_on_hand_end_period || 0),
      }))
      .filter(
        (committee) =>
          committee.total + (committee.claimedCommitted || 0) > 0,
      );
    committeesWithTotals.sort(
      (a, b) =>
        b.total +
        (b.claimedCommitted || 0) -
        (a.total + (a.claimedCommitted || 0)),
    );
    return committeesWithTotals;
  }
};

// Fetch details for a specific committee
export const fetchCommitteeDetails = async (
  committeeId: string,
): Promise<CommitteeDetails | ErrorType> => {
  cacheTag("all");
  return fetchSnapshot("committees", committeeId);
};

// Fetch donors for a specific committee
export const fetchCommitteeDonors = async (
  committeeId: string,
): Promise<Contributions | ErrorType> => {
  cacheTag("all");
  return fetchSnapshot("contributions", committeeId);
};

export const uncachedFetchCommittees = async (): Promise<
  Record<string, CommitteeConstant> | ErrorType
> => fetchSnapshot("constants", "committees");

export const fetchNonCandidateCommittees =
  async (): Promise<Set<string>> => {
    cacheTag("all");
    const data = await fetchConstant<Record<string, string[]>>(
      "nonCandidateCommittees",
    );
    if (data && "ids" in data) {
      const nonCandidateCommittees = new Set(data.ids);
      return nonCandidateCommittees;
    }
    return new Set();
  };

// EXPENDITURES ----------------------------------------------------------
export const fetchAllExpenditures = async (): Promise<
  Record<ExpenditureId, Expenditure> | ErrorType
> => {
  cacheTag("all");
  return fetchSnapshot("expenditures", "all");
};

export const fetchAllRaceIds = async (): Promise<
  Record<string, string[]> | ErrorType
> => {
  cacheTag("all");
  const data = await fetchCollection("raceDetails");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    const electionsData = data as DocumentData[];
    const raceIds: Record<string, string[]> = {};
    electionsData.forEach((doc) => {
      const electionsByState = doc.data() as ElectionsByState;
      if (!(doc.id in raceIds)) {
        raceIds[doc.id] = [];
      }
      for (const raceId of Object.keys(electionsByState)) {
        raceIds[doc.id].push(raceId);
      }
      raceIds[doc.id].sort((a, b) => {
        const senateRacePattern = /^S(-special)?$/;
        const aIsSenate = senateRacePattern.test(a);
        const bIsSenate = senateRacePattern.test(b);

        if (aIsSenate && !bIsSenate) {
          return -1;
        }
        if (!aIsSenate && bIsSenate) {
          return 1;
        }
        return a.localeCompare(b);
      });
    });
    return raceIds;
  }
};

export const fetchMapData = async (): Promise<MapData | ErrorType> => {
  cacheTag("all");
  const data = await fetchSnapshot("expenditures", "states");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    const stateData = data as Record<string, StateExpenditures>;
    const mapData: MapData = {};
    for (const state of Object.keys(stateData)) {
      if (state == "US") {
        continue;
      }
      mapData[state] = {
        total: stateData[state].total,
        by_race: {},
        by_companies: stateData[state].by_companies,
        companies_total: stateData[state].companies_total,
      };
      stateData[state].total = stateData[state].total || 0;
      for (const raceId of Object.keys(stateData[state].by_race)) {
        mapData[state].by_race[raceId] = stateData[state].by_race[raceId].total;
      }
    }
    return mapData;
  }
};

// Fetch expenditures for a specific state
export const fetchStateExpenditures = async (
  stateAbbr: string,
): Promise<PopulatedStateExpenditures | ErrorType> => {
  cacheTag("all");
  const data = await fetchSnapshot("expenditures", "states");
  if (isError(data)) {
    return data as ErrorType;
  } else if (!(stateAbbr in data)) {
    return { error: true, statusCode: 404 };
  } else {
    const statesExpenditures = data as Record<string, StateExpenditures>;
    const stateExpenditures = statesExpenditures[stateAbbr];
    const allExpendituresData = await fetchAllExpenditures();
    if (isError(allExpendituresData)) {
      return allExpendituresData as ErrorType;
    } else {
      // Populate expenditures
      const allExpenditures = allExpendituresData as Record<
        ExpenditureId,
        Expenditure
      >;
      return hydrateStateExpenditures(stateExpenditures, allExpenditures);
    }
  }
};

// Fetch recent expenditures by any committee
export const fetchAllRecentExpenditures = async (): Promise<
  Expenditure[] | ErrorType
> => {
  cacheTag("all");
  const data = await fetchSnapshot("expenditures", "recent");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    const allRecentExpenditureIds = (data as RecentExpenditures)["all"];
    const allRecentExpendituresData = await fetchAllExpenditures();
    if (isError(allRecentExpendituresData)) {
      return allRecentExpendituresData as ErrorType;
    } else {
      const allRecentExpenditures = allRecentExpendituresData as Record<
        ExpenditureId,
        Expenditure
      >;
      return allRecentExpenditureIds.map(
        (expenditureId) => allRecentExpenditures[expenditureId],
      );
    }
  }
};

// Fetch recent expenditures for a specific committee
export const fetchRecentCommitteeExpenditures = async (
  committeeId: string,
): Promise<Expenditure[] | ErrorType> => {
  cacheTag("all");
  const data = await fetchSnapshot("expenditures", "recent");
  const allRecentExpendituresData = await fetchAllExpenditures();
  if (isError(data)) {
    return data as ErrorType;
  } else if (isError(allRecentExpendituresData)) {
    return allRecentExpendituresData as ErrorType;
  } else {
    const committeeData = (data as RecentExpenditures)["by_committee"];
    const allRecentExpenditures = allRecentExpendituresData as Record<
      string,
      Expenditure
    >;
    if (committeeId in committeeData) {
      return committeeData[committeeId].map(
        (expenditureId) => allRecentExpenditures[expenditureId],
      );
    } else {
      return [];
    }
  }
};

export const fetchAllExpenditureTotalsByParty = async (): Promise<
  ExpendituresByParty | ErrorType
> => {
  cacheTag("all");
  const data = await fetchSnapshot("expenditures", "by_party");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    return data as ExpendituresByParty;
  }
};

// ELECTIONS -------------------------------------------------------------
// Note: Python backend merges races and manualRaces into races field
export const fetchAllStateElections = async (): Promise<
  Record<string, ElectionsByState> | ErrorType
> => {
  cacheTag("all");
  const data = await fetchCollection("raceDetails");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    const electionsData = data as DocumentData[];
    const electionsByState: Record<string, ElectionsByState> = {};
    electionsData.forEach((doc) => {
      electionsByState[doc.id] = doc.data() as ElectionsByState;
    });
    return electionsByState;
  }
};

export const fetchStateElections = async (
  stateAbbr: string,
): Promise<ElectionsByState | ErrorType> => {
  cacheTag("all");
  return fetchSnapshot("raceDetails", stateAbbr);
};

export const fetchElection = async (
  raceId: string,
): Promise<ElectionGroup | ErrorType> => {
  cacheTag("all");
  let state, raceParts;
  if (raceId.toUpperCase() === "PRESIDENT") {
    state = "US";
    raceParts = ["P"];
  } else {
    [state, ...raceParts] = raceId.split("-");
  }
  const shortRaceId = raceParts.join("-");
  const stateElectionsData = await fetchStateElections(state);
  if (isError(stateElectionsData)) {
    return stateElectionsData as ErrorType;
  }
  const stateElections = stateElectionsData as ElectionsByState;
  if (!(shortRaceId in stateElections)) {
    return { error: true, statusCode: 404 };
  } else {
    return stateElections[shortRaceId];
  }
};

// CANDIDATES -----------------------------------------------------------
export const fetchCandidateExpenditures = async (
  limit: number | undefined,
): Promise<ExpendituresByCandidate | ErrorType> => {
  cacheTag("all");
  const order = await fetchSnapshot("candidatesOrder", "order");
  if (isError(order)) {
    return order as ErrorType;
  }
  const candidateOrder = order.order as string[];
  if (limit) {
    const limitedCandidates = candidateOrder.slice(0, limit);
    try {
      const q = query(
        collection(db, "candidates"),
        where("common_name", "in", limitedCandidates),
      );
      const snapshot = await getDocs(q);
      const results = {
        candidates: {},
        order: limitedCandidates,
      } as ExpendituresByCandidate;
      snapshot.forEach((doc) => {
        const candidateData = doc.data() as ExpenditureCandidateSummary;
        results.candidates[candidateData.common_name] = candidateData;
      });
      return results;
    } catch (e) {
      return { error: true };
    }
  } else {
    const results = await fetchCollection("candidates");
    if (isError(results)) {
      return results as ErrorType;
    }
    const resultsData = results as DocumentData[];
    return resultsData.reduce(
      (acc, result) => {
        const candidateData = result.data();
        acc.candidates[candidateData.common_name] = candidateData;
        return acc;
      },
      { candidates: {}, order: candidateOrder } as ExpendituresByCandidate,
    ) as ExpendituresByCandidate;
  }
};

export const fetchCandidatesWithOpposeSpending = async (): Promise<
  ExpenditureCandidateSummary[] | ErrorType
> => {
  cacheTag("all");
  const [data, oppositionData] = await Promise.all([
    fetchCollection("candidates"),
    fetchConstant("oppositionSpending"),
  ]);
  if (isError(data)) {
    return data as ErrorType;
  }
  const candidates = (data as DocumentData[]).reduce(
    (acc, result) => {
      const candidateData = result.data();
      acc.candidates[candidateData.common_name] = candidateData;
      return acc;
    },
    { candidates: {} } as ExpendituresByCandidate,
  ) as ExpendituresByCandidate;

  const oppositionConstant = (oppositionData || {}) as Record<
    string,
    OppositionConstant
  >;
  return Object.values(candidates.candidates)
    .filter((candidate) => candidate.oppose_total > 0)
    .sort((a, b) => b.oppose_total - a.oppose_total)
    .map((candidate) => {
      if (
        candidate.candidate_id &&
        candidate.candidate_id in oppositionConstant
      ) {
        candidate.opposition_details =
          oppositionConstant[candidate.candidate_id];
      }
      return candidate;
    });
};

// ADS ------------------------------------------------------------------
export const fetchGoogleAds = async (): Promise<
  Record<string, AdGroup> | ErrorType
> => {
  cacheTag("all");
  return fetchSnapshot("ads", "by_committee");
};

export const fetchAdsByRace = async (
  raceId: string,
): Promise<Ad[] | ErrorType> => {
  cacheTag("all");
  const data = await fetchSnapshot("ads", "by_committee");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    let flattenedAds = Object.values(data as Record<string, AdGroup>).reduce(
      (acc, adGroup) => [...acc, ...Object.values(adGroup.ads)],
      [] as Ad[],
    );

    // Return only ads pertaining to the specified race, sorted by start date
    return flattenedAds
      .filter((ad) => ad.race === raceId)
      .sort((a, b) => getAdDate(b).localeCompare(getAdDate(a)));
  }
};

// COMPANIES ------------------------------------------------------------
export const fetchCompany = async (
  company: string,
): Promise<Company | ErrorType> => {
  cacheTag("all");
  return fetchSnapshot("companies", company);
};

// INDIVIDUALS ------------------------------------------------------------
export const fetchIndividual = async (
  individual: string,
): Promise<IndividualContributions | ErrorType> => {
  cacheTag("all");
  return fetchSnapshot("individuals", individual);
};

export const fetchAllRecipients = async (): Promise<
  Record<string, RecipientDetails> | ErrorType
> => {
  cacheTag("all");
  return fetchSnapshot("allRecipients", "recipients");
};

// BENEFICIARIIES ------------------------------------------------------------
export const fetchBeneficiaries = async (): Promise<
  Record<string, Beneficiary> | ErrorType
> => {
  cacheTag("all");
  return fetchSnapshot("allRecipients", "recipientsWithContribs");
};

export const fetchBeneficiariesOrder = async (): Promise<
  string[] | ErrorType
> => {
  cacheTag("all");
  const beneficiariesOrderData = await fetchSnapshot(
    "allRecipients",
    "recipientsOrder",
  );
  if (isError(beneficiariesOrderData)) {
    return beneficiariesOrderData as ErrorType;
  }
  return beneficiariesOrderData.order;
};

export const fetchBeneficiariesWithoutExpendituresOrder =
  async (): Promise<string[] | ErrorType> => {
    cacheTag("all");
    const beneficiariesOrderData = await fetchSnapshot(
      "allRecipients",
      "recipientsOrder",
    );
    if (isError(beneficiariesOrderData)) {
      return beneficiariesOrderData as ErrorType;
    }
    return beneficiariesOrderData.candidatesWithoutExpendituresOrder;
  };

export const fetchBeneficiariesForRace = async (
  raceId: string,
): Promise<Record<string, Beneficiary> | ErrorType> => {
  cacheTag("all");
  const [beneficiariesData, raceData] = await Promise.all([
    fetchBeneficiaries(),
    fetchElection(raceId),
  ]);
  if (isError(beneficiariesData)) {
    return beneficiariesData as ErrorType;
  } else if (isError(raceData)) {
    return raceData as ErrorType;
  } else {
    const beneficiaries = beneficiariesData as Record<string, Beneficiary>;
    const election = raceData as ElectionGroup;
    const candidatesInRace = Object.values(election.candidates).map(
      (candidate) => candidate.candidate_id,
    );
    return candidatesInRace.reduce(
      (acc, candidateId) => {
        if (candidateId && candidateId in beneficiaries) {
          acc[candidateId] = beneficiaries[candidateId];
        }
        return acc;
      },
      {} as Record<string, Beneficiary>,
    );
  }
};
