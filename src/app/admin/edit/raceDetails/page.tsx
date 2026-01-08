"use client";

import { db } from "@/app/lib/db";
import { Party, RaceType } from "@/app/types/Elections";
import { STATES_BY_ABBR } from "@/app/data/states";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import styles from "../../admin.module.css";

interface CandidateFormData {
  name: string;
  party?: Party;
  incumbent?: boolean;
  declared?: boolean;
  declined?: boolean;
  declineReason?: string;
}

interface RaceFormData {
  type: string;
  party?: Party;
  date?: string;
  candidates: CandidateFormData[];
}

export default function RaceDetailsEditor() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [raceId, setRaceId] = useState<string>("");
  const [existingRaceIds, setExistingRaceIds] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [raceForm, setRaceForm] = useState<RaceFormData>({
    type: "",
    party: undefined,
    date: "",
    candidates: [],
  });

  const stateAbbrs = Object.keys(STATES_BY_ABBR).sort();

  const addCandidate = () => {
    setRaceForm({
      ...raceForm,
      candidates: [
        ...raceForm.candidates,
        {
          name: "",
          party: raceForm.party,
          incumbent: false,
          declared: true,
          declined: false,
          declineReason: "",
        },
      ],
    });
  };

  const updateCandidate = (index: number, field: keyof CandidateFormData, value: any) => {
    const updatedCandidates = [...raceForm.candidates];
    updatedCandidates[index] = {
      ...updatedCandidates[index],
      [field]: value,
    };
    setRaceForm({
      ...raceForm,
      candidates: updatedCandidates,
    });
  };

  const removeCandidate = (index: number) => {
    const updatedCandidates = raceForm.candidates.filter((_, i) => i !== index);
    setRaceForm({
      ...raceForm,
      candidates: updatedCandidates,
    });
  };

  const fetchExistingRaces = async (state: string) => {
    try {
      const docRef = doc(db, "raceDetails", state);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const existingData = docSnap.data();
        setExistingRaceIds(Object.keys(existingData).sort());
      } else {
        setExistingRaceIds([]);
      }
    } catch (err) {
      console.error("Error fetching existing races:", err);
      setExistingRaceIds([]);
    }
  };

  const saveRace = async () => {
    if (!selectedState || !raceId || !raceForm.type || raceForm.candidates.length === 0 || saveState === "pending") {
      return;
    }

    setSaveState("pending");

    try {
      // Fetch existing raceDetails for the state
      const docRef = doc(db, "raceDetails", selectedState);
      const docSnap = await getDoc(docRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      // Build race object with conditional fields
      const race: any = {
        type: raceForm.type,
        candidates: raceForm.candidates.map((candidate) => {
          const candidateData: any = {
            name: candidate.name,
          };

          // Only include party if it's set
          if (candidate.party) {
            candidateData.party = candidate.party;
          }

          // Only include incumbent if true
          if (candidate.incumbent) {
            candidateData.incumbent = true;
          }

          // Only include declared if false
          if (candidate.declared === false) {
            candidateData.declared = false;
          }

          // Only include declined if true
          if (candidate.declined) {
            candidateData.declined = true;
          }

          // Only include declineReason if declined is true and reason is provided
          if (candidate.declined && candidate.declineReason) {
            candidateData.declineReason = candidate.declineReason;
          }

          return candidateData;
        }),
      };

      // Add optional race-level fields
      if (raceForm.party) {
        race.party = raceForm.party;
      }
      if (raceForm.date) {
        race.date = raceForm.date;
      }

      // Get or create the race group for the specified race ID
      const raceGroup = existingData[raceId] || { races: [], manualRaces: [], candidates: {}, spending: {} };

      // Save to manualRaces instead of races (races is for scraper)
      if (!raceGroup.manualRaces) {
        raceGroup.manualRaces = [];
      }
      raceGroup.manualRaces.push(race);
      raceGroup.manualRacesUpdated = Date.now();

      await setDoc(docRef, { [raceId]: raceGroup }, { merge: true });

      setSaveState("success");

      // Reset form
      setRaceForm({
        type: "",
        party: undefined,
        date: "",
        candidates: [],
      });
      setRaceId("");

      // Refresh the existing race IDs
      await fetchExistingRaces(selectedState);

      setTimeout(() => setSaveState("idle"), 2000);
    } catch (err) {
      console.error("Error saving race:", err);
      setSaveState("error");
      setTimeout(() => setSaveState("idle"), 3000);
    }
  };

  return (
    <>
      <h1>Race Details Editor</h1>
      <section className={styles.editorCard}>
        {/* State Selection */}
        <div className={styles.editorInputGroup}>
          <label htmlFor="state-select">Select State</label>
          <select
            id="state-select"
            className={styles.editorSelect}
            onChange={(e) => {
              const state = e.target.value;
              setSelectedState(state);
              setRaceId("");
              if (state) {
                fetchExistingRaces(state);
              } else {
                setExistingRaceIds([]);
              }
            }}
            value={selectedState}
          >
            <option value="">Select a state</option>
            {stateAbbrs.map((abbr) => (
              <option key={abbr} value={abbr}>
                {STATES_BY_ABBR[abbr]} ({abbr})
              </option>
            ))}
          </select>
        </div>

        {selectedState && (
          <>
            <h2>Add New Race for {STATES_BY_ABBR[selectedState]}</h2>

            {/* Race ID Selection/Input */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-id">Race ID *</label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <select
                  id="race-id"
                  className={styles.editorSelect}
                  value={raceId}
                  onChange={(e) => setRaceId(e.target.value)}
                  style={{ minWidth: "200px" }}
                >
                  <option value="">Select or enter race ID</option>
                  <option value="__custom">Enter custom race ID...</option>
                  {existingRaceIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
                {raceId === "__custom" && (
                  <input
                    type="text"
                    className={styles.editorInput}
                    placeholder="e.g., H-01, S, P"
                    onChange={(e) => setRaceId(e.target.value)}
                    autoFocus
                    style={{ minWidth: "150px" }}
                  />
                )}
              </div>
              <small style={{ color: "#666", marginTop: "0.25rem", display: "block" }}>
                Examples: H-01 (House District 1), S (Senate), P (President), G (Governor)
              </small>
            </div>

            {/* Race Type */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-type">Race Type *</label>
              <select
                id="race-type"
                className={styles.editorSelect}
                value={raceForm.type}
                onChange={(e) => setRaceForm({ ...raceForm, type: e.target.value })}
              >
                <option value="">Select type</option>
                <option value={RaceType.General}>General</option>
                <option value={RaceType.Primary}>Primary</option>
                <option value={RaceType.PrimaryRunoff}>Primary Runoff</option>
                <option value={RaceType.Convention}>Convention</option>
                <option value={RaceType.Special}>Special</option>
              </select>
            </div>

            {/* Race Party */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-party">Party (optional)</label>
              <select
                id="race-party"
                className={styles.editorSelect}
                value={raceForm.party || ""}
                onChange={(e) => setRaceForm({ ...raceForm, party: e.target.value as Party || undefined })}
              >
                <option value="">None</option>
                <option value={Party.Republican}>Republican (R)</option>
                <option value={Party.Democratic}>Democratic (D)</option>
                <option value={Party.Libertarian}>Libertarian (L)</option>
                <option value={Party.Green}>Green (G)</option>
                <option value={Party.Independent}>Independent (I)</option>
              </select>
            </div>

            {/* Race Date */}
            <div className={styles.editorInputGroup}>
              <label htmlFor="race-date">Date (optional)</label>
              <input
                type="text"
                id="race-date"
                className={styles.editorInput}
                value={raceForm.date}
                onChange={(e) => setRaceForm({ ...raceForm, date: e.target.value })}
                placeholder="e.g., 2026-11-03"
              />
            </div>

            <h3>Candidates</h3>

            {raceForm.candidates.map((candidate, index) => (
              <div key={index} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem", borderRadius: "4px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ margin: 0 }}>Candidate {index + 1}</h4>
                  <button onClick={() => removeCandidate(index)} style={{ color: "red" }}>
                    Remove
                  </button>
                </div>

                {/* Candidate Name */}
                <div className={styles.editorInputGroup}>
                  <label htmlFor={`candidate-name-${index}`}>Name *</label>
                  <input
                    type="text"
                    id={`candidate-name-${index}`}
                    className={styles.editorInput}
                    value={candidate.name}
                    onChange={(e) => updateCandidate(index, "name", e.target.value)}
                  />
                </div>

                {/* Candidate Party */}
                <div className={styles.editorInputGroup}>
                  <label htmlFor={`candidate-party-${index}`}>Party</label>
                  <select
                    id={`candidate-party-${index}`}
                    className={styles.editorSelect}
                    value={candidate.party || ""}
                    onChange={(e) => updateCandidate(index, "party", e.target.value as Party || undefined)}
                  >
                    <option value="">None</option>
                    <option value={Party.Republican}>Republican (R)</option>
                    <option value={Party.Democratic}>Democratic (D)</option>
                    <option value={Party.Libertarian}>Libertarian (L)</option>
                    <option value={Party.Green}>Green (G)</option>
                    <option value={Party.Independent}>Independent (I)</option>
                  </select>
                </div>

                {/* Incumbent Checkbox */}
                <div className={styles.editorInputGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={candidate.incumbent || false}
                      onChange={(e) => updateCandidate(index, "incumbent", e.target.checked)}
                    />
                    {" "}Incumbent
                  </label>
                </div>

                {/* Declared Checkbox */}
                <div className={styles.editorInputGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={candidate.declared !== false}
                      onChange={(e) => updateCandidate(index, "declared", e.target.checked)}
                    />
                    {" "}Declared (uncheck if not declared)
                  </label>
                </div>

                {/* Declined Checkbox */}
                <div className={styles.editorInputGroup}>
                  <label>
                    <input
                      type="checkbox"
                      checked={candidate.declined || false}
                      onChange={(e) => updateCandidate(index, "declined", e.target.checked)}
                    />
                    {" "}Declined
                  </label>
                </div>

                {/* Decline Reason (only if declined) */}
                {candidate.declined && (
                  <div className={styles.editorInputGroup}>
                    <label htmlFor={`candidate-decline-reason-${index}`}>Decline Reason</label>
                    <input
                      type="text"
                      id={`candidate-decline-reason-${index}`}
                      className={styles.editorInput}
                      value={candidate.declineReason || ""}
                      onChange={(e) => updateCandidate(index, "declineReason", e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}

            <button onClick={addCandidate} style={{ marginBottom: "1rem" }}>
              Add Candidate
            </button>

            <div>
              <button
                onClick={saveRace}
                disabled={saveState === "pending" || !raceId || raceId === "__custom" || !raceForm.type || raceForm.candidates.length === 0}
                style={{
                  padding: "0.5rem 1rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                {saveState === "pending" ? "Saving..." : "Save Race"}
              </button>
              {saveState === "success" && (
                <span style={{ marginLeft: "1rem", color: "green" }}>
                  Saved successfully to {selectedState}/{raceId}!
                </span>
              )}
              {saveState === "error" && (
                <span style={{ marginLeft: "1rem", color: "red" }}>Error saving race</span>
              )}
            </div>
          </>
        )}
      </section>
    </>
  );
}
