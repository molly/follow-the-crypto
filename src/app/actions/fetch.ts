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
  Expenditure,
  ExpenditureId,
  ExpendituresByCandidate,
  ExpendituresByParty,
  PopulatedStateExpenditures,
  RecentExpenditures,
  StateExpenditures,
} from "../types/Expenditures";
import { MapData } from "../types/MapData";

import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { cache } from "react";
import { ElectionsByState } from "../types/Elections";
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

export const fetchCommitteeTotalExpenditures = cache(
  async (): Promise<number | ErrorType> => {
    const snapshot = await fetchSnapshot("expenditures", "total");
    if (isError(snapshot)) {
      return snapshot as ErrorType;
    } else {
      return snapshot.total;
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
export const fetchAllExpenditures = cache(
  async (): Promise<Record<ExpenditureId, Expenditure> | ErrorType> =>
    fetchSnapshot("expenditures", "all"),
);

export const fetchMapData = cache(async (): Promise<MapData | ErrorType> => {
  const data = await fetchSnapshot("expenditures", "states");
  if (isError(data)) {
    return data as ErrorType;
  } else {
    const stateData = data as Record<string, StateExpenditures>;
    const mapData: MapData = {};
    for (const state of Object.keys(stateData)) {
      mapData[state] = {
        total: stateData[state].total,
        by_race: {},
      };
      stateData[state].total = stateData[state].total || 0;
      for (const raceId of Object.keys(stateData[state].by_race)) {
        mapData[state].by_race[raceId] = stateData[state].by_race[raceId].total;
      }
    }
    return mapData;
  }
});

// Fetch expenditures for a specific state
export const fetchStateExpenditures = cache(
  async (
    stateAbbr: string,
  ): Promise<PopulatedStateExpenditures | ErrorType> => {
    const data = await fetchSnapshot("expenditures", "states");
    if (isError(data)) {
      return data as ErrorType;
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
  },
);

// Fetch recent expenditures by any committee
export const fetchAllRecentExpenditures = cache(
  async (): Promise<Expenditure[] | ErrorType> => {
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
  },
);

// Fetch recent expenditures for a specific committee
export const fetchRecentCommitteeExpenditures = cache(
  async (committeeId: string): Promise<Expenditure[] | ErrorType> => {
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
  },
);

export const fetchAllExpenditureTotalsByParty = cache(
  async (): Promise<ExpendituresByParty | ErrorType> => {
    const data = await fetchSnapshot("expenditures", "by_party");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      return data as ExpendituresByParty;
    }
  },
);

// ELECTIONS -------------------------------------------------------------
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
