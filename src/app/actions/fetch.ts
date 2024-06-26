import { db } from "@/app/lib/db";
import {
  AllCommitteesSummary,
  CommitteeConstant,
  CommitteeDetails,
} from "@/app/types/Committee";
import { Contributions } from "@/app/types/Contributions";
import { ErrorType, isError } from "@/app/utils/errors";
import { Ad, AdGroup } from "../types/Ads";
import {
  Expenditures,
  ExpendituresByCandidate,
  RecentCommitteeExpenditures,
} from "../types/Expenditures";

import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { cache } from "react";
import { ElectionsByState } from "../types/Elections";

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

export const fetchConstant = cache(
  async <T>(key: string): Promise<T | null> => {
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
  },
);

// ----------------------------------------------------------------------

// TOTALS ---------------------------------------------------------------
export const fetchCommitteeTotalReceipts = cache(
  async (): Promise<number | ErrorType> => {
    const snapshot = await fetchSnapshot("totals", "committees");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    } else {
      return snapshot.receipts;
    }
  },
);

export const fetchCommitteeTotalDisbursements = cache(
  async (): Promise<number | ErrorType> => {
    const snapshot = await fetchSnapshot("totals", "committees");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    } else {
      return snapshot.disbursements;
    }
  },
);

// ALL COMMITTEES -------------------------------------------------------
export const fetchPACsByReceipts = cache(
  async (): Promise<AllCommitteesSummary[] | ErrorType> => {
    const data = await fetchSnapshot("allCommittees", "allPacs");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      return data.by_receipts as AllCommitteesSummary[];
    }
  },
);

export const fetchSuperPACsByReceipts = cache(
  async (): Promise<AllCommitteesSummary[] | ErrorType> => {
    const data = await fetchSnapshot("allCommittees", "superPacs");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      return data.by_receipts as AllCommitteesSummary[];
    }
  },
);

// COMMITTEES -----------------------------------------------------------

// Fetch all committees and sort them by total receipts
export const fetchAllCommittees = cache(
  async (): Promise<CommitteeDetails[] | ErrorType> => {
    const data = await fetchCollection("committees");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      const committeesData = data as DocumentData[];
      const committees = committeesData.map((doc) =>
        doc.data(),
      ) as CommitteeDetails[];
      committees.sort((a, b) => (b.receipts || 0) - (a.receipts || 0));
      return committees;
    }
  },
);

// Fetch details for a specific committee
export const fetchCommitteeDetails = cache(
  async (committeeId: string): Promise<CommitteeDetails | ErrorType> =>
    fetchSnapshot("committees", committeeId),
);

// Fetch donors for a specific committee
export const fetchCommitteeDonors = cache(
  async (committeeId: string): Promise<Contributions | ErrorType> =>
    fetchSnapshot("contributions", committeeId),
);

export const uncachedFetchCommittees = async (): Promise<
  Record<string, CommitteeConstant> | ErrorType
> => fetchSnapshot("constants", "committees");

// EXPENDITURES ----------------------------------------------------------
export const fetchAllStateExpenditures = cache(
  async (): Promise<Record<string, Expenditures> | ErrorType> => {
    const data = await fetchCollection("expendituresByState");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      const expendituresData = data as DocumentData[];
      const expendituresByState: Record<string, Expenditures> = {};
      expendituresData.forEach((doc) => {
        expendituresByState[doc.id] = doc.data() as Expenditures;
      });
      return expendituresByState;
    }
  },
);

// Fetch expenditures for a specific state
export const fetchStateExpenditures = cache(
  async (stateAbbr: string): Promise<Expenditures | ErrorType> =>
    fetchSnapshot("expendituresByState", stateAbbr),
);

// Fetch expenditures for a specific committee
export const fetchRecentCommitteeExpenditures = cache(
  async (
    committeeId: string,
  ): Promise<Record<string, RecentCommitteeExpenditures> | ErrorType> =>
    fetchSnapshot("expenditures", "committee"),
);

//ELECTIONS -------------------------------------------------------------
export const fetchAllStateElections = cache(
  async (): Promise<Record<string, ElectionsByState> | ErrorType> => {
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
  },
);

export const fetchStateElections = cache(
  async (stateAbbr: string): Promise<ElectionsByState | ErrorType> =>
    fetchSnapshot("raceDetails", stateAbbr),
);

// CANDIDATES -----------------------------------------------------------
export const fetchCandidateExpenditures = cache(
  async (): Promise<ExpendituresByCandidate | ErrorType> =>
    fetchSnapshot("candidates", "bySpending"),
);

// ADS ------------------------------------------------------------------
export const fetchAds = cache(
  async (): Promise<Record<string, AdGroup> | ErrorType> =>
    fetchSnapshot("ads", "google"),
);

export const fetchAdsByRace = cache(
  async (raceId: string): Promise<Ad[] | ErrorType> => {
    const data = await fetchSnapshot("ads", "google");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      const flattenedAds = Object.values(
        data as Record<string, AdGroup>,
      ).reduce(
        (acc, adGroup) => [...acc, ...Object.values(adGroup.ads)],
        [] as Ad[],
      );

      // Return only ads pertaining to the specified race, sorted by start date
      return flattenedAds
        .filter((ad) => ad.race === raceId)
        .sort((a, b) => a.date_range_start.localeCompare(b.date_range_start));
    }
  },
);
