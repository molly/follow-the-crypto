"use client";

import { db } from "@/app/lib/db";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styles from "../../admin.module.css";

type AffiliationType = "party" | "candidate_ids" | "sponsor_candidate_ids";
type PartyValue = "DEM" | "REP" | "LIB" | "UNK";

type Affiliation =
  | { party: PartyValue }
  | { candidate_ids: string[] }
  | { sponsor_candidate_ids: string[] };

type CommitteeEntry = {
  committeeId: string;
  description: string;
  hasAffiliation: boolean;
  affiliationType: AffiliationType;
  party: PartyValue;
  candidateIds: string;
  sponsorCandidateIds: string;
};

type SaveState = "idle" | "pending" | "success" | "error";

function buildEntry(
  committeeId: string,
  description: string,
  affiliation: Affiliation | null,
): CommitteeEntry {
  const base: CommitteeEntry = {
    committeeId,
    description,
    hasAffiliation: affiliation !== null,
    affiliationType: "party",
    party: "UNK",
    candidateIds: "",
    sponsorCandidateIds: "",
  };
  if (!affiliation) return base;
  if ("party" in affiliation) {
    return { ...base, affiliationType: "party", party: affiliation.party };
  } else if ("candidate_ids" in affiliation) {
    return {
      ...base,
      affiliationType: "candidate_ids",
      candidateIds: affiliation.candidate_ids.join(", "),
    };
  } else {
    return {
      ...base,
      affiliationType: "sponsor_candidate_ids",
      sponsorCandidateIds: affiliation.sponsor_candidate_ids.join(", "),
    };
  }
}

function entryToAffiliation(entry: CommitteeEntry): Affiliation | null {
  if (!entry.hasAffiliation) return null;
  switch (entry.affiliationType) {
    case "party":
      return { party: entry.party };
    case "candidate_ids":
      return {
        candidate_ids: entry.candidateIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
    case "sponsor_candidate_ids":
      return {
        sponsor_candidate_ids: entry.sponsorCandidateIds
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      };
  }
}

export default function ConstantsEditor() {
  const [loadingState, setLoadingState] = useState("loading");
  const [entries, setEntries] = useState<CommitteeEntry[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  useEffect(() => {
    (async () => {
      try {
        const [committeesSnap, affiliationsSnap] = await Promise.all([
          getDoc(doc(db, "constants", "allCommittees")),
          getDoc(doc(db, "constants", "committeeAffiliations")),
        ]);

        const descriptions: Record<string, string> = committeesSnap.exists()
          ? (committeesSnap.data() as Record<string, string>)
          : {};
        const affiliations: Record<string, Affiliation> =
          affiliationsSnap.exists()
            ? (affiliationsSnap.data() as Record<string, Affiliation>)
            : {};

        const allIds = new Set([
          ...Object.keys(descriptions),
          ...Object.keys(affiliations),
        ]);

        setEntries(
          [...allIds]
            .sort((a, b) => a.localeCompare(b))
            .map((id) =>
              buildEntry(id, descriptions[id] ?? "", affiliations[id] ?? null),
            ),
        );
        setLoadingState("loaded");
      } catch {
        setLoadingState("error");
      }
    })();
  }, []);

  const updateEntry = (
    index: number,
    field: keyof CommitteeEntry,
    value: string | boolean,
  ) => {
    setEntries((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        committeeId: "",
        description: "",
        hasAffiliation: false,
        affiliationType: "party" as AffiliationType,
        party: "UNK" as PartyValue,
        candidateIds: "",
        sponsorCandidateIds: "",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaveState("pending");
    try {
      const committeeData: Record<string, string> = {};
      const affiliationData: Record<string, Affiliation> = {};
      for (const entry of entries) {
        if (!entry.committeeId) continue;
        if (entry.description) {
          committeeData[entry.committeeId] = entry.description;
        }
        const aff = entryToAffiliation(entry);
        if (aff) {
          affiliationData[entry.committeeId] = aff;
        }
      }
      await Promise.all([
        setDoc(doc(db, "constants", "allCommittees"), committeeData),
        setDoc(doc(db, "constants", "committeeAffiliations"), affiliationData),
      ]);
      setSaveState("success");
    } catch {
      setSaveState("error");
    }
  };

  if (loadingState === "loading") {
    return <div>Loading...</div>;
  } else if (loadingState === "error") {
    return <div>Something went wrong when fetching data.</div>;
  }

  return (
    <>
      <h1>Committee Constants</h1>
      <section className={styles.editorCard}>
        <table className={styles.constantsTable}>
          <thead>
            <tr>
              <th>Committee ID</th>
              <th>Description</th>
              <th>Affiliation</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} style={{ verticalAlign: "top" }}>
                <td>
                  <input
                    type="text"
                    className={styles.editorInput}
                    value={entry.committeeId}
                    onChange={(e) =>
                      updateEntry(i, "committeeId", e.target.value)
                    }
                    placeholder="Committee ID"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className={styles.editorInput}
                    value={entry.description}
                    onChange={(e) =>
                      updateEntry(i, "description", e.target.value)
                    }
                    placeholder="Description (optional)"
                    style={{ minWidth: 250 }}
                  />
                </td>
                <td>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    <label style={{ fontSize: "0.85em" }}>
                      <input
                        type="checkbox"
                        checked={entry.hasAffiliation}
                        onChange={(e) =>
                          updateEntry(i, "hasAffiliation", e.target.checked)
                        }
                      />{" "}
                      Has affiliation
                    </label>
                    {entry.hasAffiliation && (
                      <div style={{ display: "flex", gap: "0.25rem" }}>
                        <select
                          className={styles.editorSelect}
                          value={entry.affiliationType}
                          onChange={(e) =>
                            updateEntry(i, "affiliationType", e.target.value)
                          }
                        >
                          <option value="party">Party</option>
                          <option value="candidate_ids">Candidate IDs</option>
                          <option value="sponsor_candidate_ids">
                            Sponsor Candidate IDs
                          </option>
                        </select>
                        {entry.affiliationType === "party" && (
                          <select
                            className={styles.editorSelect}
                            value={entry.party}
                            onChange={(e) =>
                              updateEntry(i, "party", e.target.value)
                            }
                          >
                            <option value="DEM">DEM</option>
                            <option value="REP">REP</option>
                            <option value="LIB">LIB</option>
                            <option value="UNK">UNK</option>
                          </select>
                        )}
                        {entry.affiliationType === "candidate_ids" && (
                          <input
                            type="text"
                            className={styles.editorInput}
                            value={entry.candidateIds}
                            onChange={(e) =>
                              updateEntry(i, "candidateIds", e.target.value)
                            }
                            placeholder="Comma-separated candidate IDs"
                            style={{ minWidth: 250 }}
                          />
                        )}
                        {entry.affiliationType === "sponsor_candidate_ids" && (
                          <input
                            type="text"
                            className={styles.editorInput}
                            value={entry.sponsorCandidateIds}
                            onChange={(e) =>
                              updateEntry(
                                i,
                                "sponsorCandidateIds",
                                e.target.value,
                              )
                            }
                            placeholder="Comma-separated sponsor candidate IDs"
                            style={{ minWidth: 250 }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <button onClick={() => removeEntry(i)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
          <button onClick={addEntry}>Add entry</button>
          <button onClick={save} disabled={saveState === "pending"}>
            {saveState === "pending" ? "Saving..." : "Save"}
          </button>
          {saveState === "success" && <span>Saved!</span>}
          {saveState === "error" && <span>Error saving.</span>}
        </div>
      </section>
    </>
  );
}
