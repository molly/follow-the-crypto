import { db } from "@/app/lib/db";

import { CommitteeConstant, CommitteeDetails } from "@/app/types/Committee";
import { Contributions } from "@/app/types/Contributions";
import { ErrorType, isError } from "@/app/utils/errors";
import { Expenditures } from "../types/Expenditures";

import {
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { cache } from "react";
import { ElectionGroup } from "../types/Elections";

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
): Promise<QuerySnapshot | ErrorType> => {
  try {
    const docRef = collection(db, collectionName);
    return getDocs(docRef);
  } catch (e) {
    return { error: true };
  }
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

// COMMITTEES -----------------------------------------------------------

// Fetch all committees and sort them by total receipts
export const fetchAllCommittees = cache(
  async (): Promise<CommitteeDetails[] | ErrorType> => {
    const data = await fetchCollection("committees");
    if (isError(data)) {
      return data as ErrorType;
    } else {
      const committeesData = data as QuerySnapshot;
      const committees = committeesData.docs.map((doc) =>
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
      const expendituresData = data as QuerySnapshot;
      const expendituresByState: Record<string, Expenditures> = {};
      expendituresData.docs.forEach((doc) => {
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

// ELECTIONS -------------------------------------------------------------
export const fetchStateElections = cache(
  async (
    stateAbbr: string,
  ): Promise<Record<string, ElectionGroup> | ErrorType> =>
    fetchSnapshot("electionsByState", stateAbbr),
);
