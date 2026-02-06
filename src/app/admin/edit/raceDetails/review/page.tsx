"use client";

import { STATES_BY_ABBR } from "@/app/data/states";
import { db } from "@/app/lib/db";
import { ElectionsByState, Race } from "@/app/types/Elections";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "../../../admin.module.css";

interface RaceConflict {
  state: string;
  raceId: string;
  manualRaces: Race[];
  scrapedRaces: Race[];
  currentRaces: Race[];
}

interface ConflictGroup {
  state: string;
  raceId: string;
}

export default function RaceReviewPage() {
  const [conflicts, setConflicts] = useState<RaceConflict[]>([]);
  const [selectedConflict, setSelectedConflict] = useState<RaceConflict | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  useEffect(() => {
    loadConflicts();
  }, []);

  const generateRaceKey = (race: Race): string => {
    const raceType = race.type || "";
    const party = race.party || "none";
    const date = race.date || "";
    return `${raceType}-${party}-${date}`;
  };

  const loadConflicts = async () => {
    setLoading(true);
    try {
      const raceDetailsCollection = collection(db, "raceDetails");
      const snapshot = await getDocs(raceDetailsCollection);

      const foundConflicts: RaceConflict[] = [];

      snapshot.forEach((stateDoc) => {
        const state = stateDoc.id;
        const stateData = stateDoc.data() as ElectionsByState;

        Object.entries(stateData).forEach(([raceId, raceGroup]) => {
          const manualRaces = raceGroup.manualRaces || [];
          const scrapedRaces = raceGroup.scrapedRaces || [];
          const currentRaces = raceGroup.races || [];
          const lastReviewed = raceGroup.lastReviewed || 0;
          const manualRacesUpdated = raceGroup.manualRacesUpdated || 0;
          const scrapedRacesUpdated = raceGroup.scrapedRacesUpdated || 0;

          // Check if there are new changes since last review
          const hasUnreviewedManual =
            manualRaces.length > 0 && manualRacesUpdated > lastReviewed;
          const hasUnreviewedScraped =
            scrapedRaces.length > 0 && scrapedRacesUpdated > lastReviewed;

          if (hasUnreviewedManual || hasUnreviewedScraped) {
            foundConflicts.push({
              state,
              raceId,
              manualRaces,
              scrapedRaces,
              currentRaces,
            });
          }
        });
      });

      setConflicts(foundConflicts);
    } catch (error) {
      console.error("Error loading conflicts:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyMerge = async (
    conflict: RaceConflict,
    action: "use_manual" | "use_scraped" | "use_both" | "keep_current",
  ) => {
    setSaveState("pending");
    try {
      let newRaces: Race[] = [];

      switch (action) {
        case "use_manual":
          newRaces = conflict.manualRaces;
          break;
        case "use_scraped":
          newRaces = conflict.scrapedRaces;
          break;
        case "use_both":
          // Combine both, removing duplicates based on race key
          const raceMap = new Map<string, Race>();
          conflict.scrapedRaces.forEach((race) => {
            raceMap.set(generateRaceKey(race), race);
          });
          conflict.manualRaces.forEach((race) => {
            raceMap.set(generateRaceKey(race), race);
          });
          newRaces = Array.from(raceMap.values());
          break;
        case "keep_current":
          newRaces = conflict.currentRaces;
          break;
      }

      const docRef = doc(db, "raceDetails", conflict.state);
      await updateDoc(docRef, {
        [`${conflict.raceId}.races`]: newRaces,
        [`${conflict.raceId}.lastReviewed`]: Date.now(),
      });

      setSaveState("success");
      setTimeout(() => setSaveState("idle"), 2000);

      // Reload conflicts to update the list
      await loadConflicts();
      setSelectedConflict(null);
    } catch (error) {
      console.error("Error applying merge:", error);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  const formatRace = (race: Race): string => {
    const type = race.type || "Unknown";
    const party = race.party ? ` (${race.party})` : "";
    const date = race.date ? ` - ${race.date}` : "";
    return `${type}${party}${date}`;
  };

  const formatCandidate = (candidate: any): string => {
    const name = candidate.name;
    const party = candidate.party ? ` (${candidate.party})` : "";
    const incumbent = candidate.incumbent ? " [Incumbent]" : "";
    const won =
      candidate.won === true ? " ✓ Won" : candidate.won === false ? " ✗" : "";
    return `${name}${party}${incumbent}${won}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Race Review & Merge</h1>
        <p>Loading conflicts...</p>
      </div>
    );
  }

  if (selectedConflict) {
    const conflict = selectedConflict;
    const manualKeys = new Set(conflict.manualRaces.map(generateRaceKey));
    const scrapedKeys = new Set(conflict.scrapedRaces.map(generateRaceKey));
    const bothKeys = new Set(
      [...conflict.manualRaces, ...conflict.scrapedRaces].map(generateRaceKey),
    );

    return (
      <div className={styles.container}>
        <div style={{ marginBottom: "20px" }}>
          <button onClick={() => setSelectedConflict(null)}>
            ← Back to List
          </button>
          <h1>
            {STATES_BY_ABBR[conflict.state]} - {conflict.raceId}
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {/* Manual Races Column */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h2>Manual Races ({conflict.manualRaces.length})</h2>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              From admin entry UI
            </p>
            {conflict.manualRaces.length === 0 ? (
              <p>No manual races</p>
            ) : (
              conflict.manualRaces.map((race, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    backgroundColor: scrapedKeys.has(generateRaceKey(race))
                      ? "#fff3cd"
                      : "#d1ecf1",
                    borderRadius: "3px",
                  }}
                >
                  <strong>{formatRace(race)}</strong>
                  {scrapedKeys.has(generateRaceKey(race)) && (
                    <span style={{ marginLeft: "10px", color: "#856404" }}>
                      ⚠ Conflict
                    </span>
                  )}
                  <ul style={{ marginTop: "5px", marginBottom: "0" }}>
                    {race.candidates.map((candidate, cidx) => (
                      <li key={cidx} style={{ fontSize: "0.9em" }}>
                        {formatCandidate(candidate)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
            {conflict.manualRaces.length > 0 && (
              <button
                onClick={() => applyMerge(conflict, "use_manual")}
                disabled={saveState === "pending"}
                style={{ marginTop: "10px", width: "100%" }}
              >
                Use Manual Races
              </button>
            )}
          </div>

          {/* Scraped Races Column */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <h2>Scraped Races ({conflict.scrapedRaces.length})</h2>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              From Python scraper
            </p>
            {conflict.scrapedRaces.length === 0 ? (
              <p>No scraped races</p>
            ) : (
              conflict.scrapedRaces.map((race, idx) => (
                <div
                  key={idx}
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    backgroundColor: manualKeys.has(generateRaceKey(race))
                      ? "#fff3cd"
                      : "#d4edda",
                    borderRadius: "3px",
                  }}
                >
                  <strong>{formatRace(race)}</strong>
                  {manualKeys.has(generateRaceKey(race)) && (
                    <span style={{ marginLeft: "10px", color: "#856404" }}>
                      ⚠ Conflict
                    </span>
                  )}
                  {!manualKeys.has(generateRaceKey(race)) && (
                    <span style={{ marginLeft: "10px", color: "#155724" }}>
                      ✓ New
                    </span>
                  )}
                  <ul style={{ marginTop: "5px", marginBottom: "0" }}>
                    {race.candidates.map((candidate, cidx) => (
                      <li key={cidx} style={{ fontSize: "0.9em" }}>
                        {formatCandidate(candidate)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
            {conflict.scrapedRaces.length > 0 && (
              <button
                onClick={() => applyMerge(conflict, "use_scraped")}
                disabled={saveState === "pending"}
                style={{ marginTop: "10px", width: "100%" }}
              >
                Use Scraped Races
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => applyMerge(conflict, "use_both")}
            disabled={saveState === "pending"}
            style={{ padding: "10px 20px" }}
          >
            Use Both (Merge All Unique Races)
          </button>
          <button
            onClick={() => applyMerge(conflict, "keep_current")}
            disabled={saveState === "pending"}
            style={{ padding: "10px 20px", backgroundColor: "#6c757d" }}
          >
            Keep Current (Mark Reviewed)
          </button>
        </div>

        {saveState === "success" && (
          <p style={{ color: "green", textAlign: "center", marginTop: "10px" }}>
            ✓ Successfully saved!
          </p>
        )}
        {saveState === "error" && (
          <p style={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            ✗ Error saving changes
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Race Review & Merge</h1>
      <p>Review and merge manual and scraped race data</p>

      {conflicts.length === 0 ? (
        <div style={{ marginTop: "20px" }}>
          <p>✓ No conflicts or unreviewed changes found!</p>
          <button onClick={loadConflicts} style={{ marginTop: "10px" }}>
            Refresh
          </button>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Found {conflicts.length} race{conflicts.length !== 1 ? "s" : ""}{" "}
            with differences to review
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {conflicts.map((conflict, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor: "#f8f9fa",
                }}
                onClick={() => setSelectedConflict(conflict)}
              >
                <h3 style={{ margin: "0 0 5px 0" }}>
                  {STATES_BY_ABBR[conflict.state]} - {conflict.raceId}
                </h3>
                <p style={{ margin: "0", fontSize: "0.9em", color: "#666" }}>
                  Manual: {conflict.manualRaces.length} race
                  {conflict.manualRaces.length !== 1 ? "s" : ""} | Scraped:{" "}
                  {conflict.scrapedRaces.length} race
                  {conflict.scrapedRaces.length !== 1 ? "s" : ""} | Current:{" "}
                  {conflict.currentRaces.length} race
                  {conflict.currentRaces.length !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
