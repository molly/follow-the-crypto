"use client";

import { uncachedFetchCommittees } from "@/app/actions/fetch";
import ReviewStatusBadge from "@/app/components/ReviewStatusBadge";
import { db } from "@/app/lib/db";
import { CommitteeConstant } from "@/app/types/Committee";
import {
  Contribution,
  Contributions,
  ManualReview,
  RollupContribution,
  SingleContribution,
} from "@/app/types/Contributions";
import { isError } from "@/app/utils/errors";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styles from "../../../admin.module.css";

// Helper to check if contribution is a rollup
function isRollup(contribution: Contribution): contribution is RollupContribution {
  return "total" in contribution && "oldest" in contribution;
}

// Generate contribution ID matching Python backend logic
function getContributionId(contribution: Contribution): string {
  if (isRollup(contribution)) {
    // Rollup: rollup_{name}_{amount}_{date}
    const name = contribution.contributor_name || "";
    const amount = contribution.total_receipt_amount || 0;
    const date = contribution.oldest || "";
    return `rollup_${name}_${amount}_${date}`;
  } else {
    // Single contribution: txn_{transaction_id}
    const single = contribution as SingleContribution;
    return `txn_${single.transaction_id}`;
  }
}

// Format currency
function formatCurrency(amount?: number): string {
  if (amount === undefined) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date - parse as local date to avoid timezone issues
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    // Parse YYYY-MM-DD as local date (not UTC) to avoid timezone conversion
    const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isNaN(date.getTime())) {
        return `Invalid: ${dateStr}`;
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Fallback for other formats
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return `Invalid: ${dateStr}`;
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return `Invalid: ${dateStr}`;
  }
}

type ContributionWithGroup = Contribution & {
  groupName?: string;
};

export default function ContributionReviewPage() {
  const [committees, setCommittees] = useState<Record<
    string,
    CommitteeConstant
  > | null>(null);
  const [selectedCommitteeId, setSelectedCommitteeId] = useState<string>("");
  const [contributions, setContributions] = useState<Contributions | null>(
    null
  );
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [saveStates, setSaveStates] = useState<Record<string, string>>({});
  const [editingContribution, setEditingContribution] = useState<string | null>(
    null
  );
  const [editDescription, setEditDescription] = useState("");

  // Load committees on mount
  useEffect(() => {
    (async () => {
      const data = await uncachedFetchCommittees();
      if (isError(data)) {
        console.error("Error loading committees");
      } else {
        setCommittees(data as Record<string, CommitteeConstant>);
      }
    })();
  }, []);

  // Load contributions when committee is selected
  useEffect(() => {
    if (!selectedCommitteeId) {
      setContributions(null);
      return;
    }

    (async () => {
      setLoadingState("loading");
      try {
        const docRef = doc(db, "contributions", selectedCommitteeId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setContributions(snapshot.data() as Contributions);
          setLoadingState("loaded");
        } else {
          setLoadingState("error");
        }
      } catch (error) {
        console.error("Error loading contributions:", error);
        setLoadingState("error");
      }
    })();
  }, [selectedCommitteeId]);

  const updateContributionReview = async (
    contribution: Contribution,
    status: "verified" | "omit",
    description: string
  ) => {
    if (!selectedCommitteeId || !contributions) return;

    const contributionId = getContributionId(contribution);
    setSaveStates({ ...saveStates, [contributionId]: "pending" });

    const manualReview: ManualReview = {
      reviewed: true,
      status,
      reviewed_at: new Date().toISOString(),
    };

    try {
      // Update the contribution in both by_date and groups arrays
      const updatedContributions = { ...contributions };

      // Update in by_date
      updatedContributions.by_date = updatedContributions.by_date.map((c) =>
        getContributionId(c) === contributionId
          ? {
              ...c,
              manualReview,
              ...(description && { description }), // Add description at top level if provided
            }
          : c
      );

      // Update in groups
      updatedContributions.groups = updatedContributions.groups.map((group) => ({
        ...group,
        contributions: group.contributions.map((c) =>
          getContributionId(c) === contributionId
            ? {
                ...c,
                manualReview,
                ...(description && { description }), // Add description at top level if provided
              }
            : c
        ),
      }));

      // Write to Firestore
      const docRef = doc(db, "contributions", selectedCommitteeId);
      await updateDoc(docRef, updatedContributions);

      // Update local state
      setContributions(updatedContributions);
      setSaveStates({ ...saveStates, [contributionId]: "success" });
      setEditingContribution(null);
      setEditDescription("");

      // Clear success state after 2 seconds
      setTimeout(() => {
        setSaveStates((prev) => {
          const updated = { ...prev };
          delete updated[contributionId];
          return updated;
        });
      }, 2000);
    } catch (error) {
      console.error("Error updating contribution:", error);
      setSaveStates({ ...saveStates, [contributionId]: "error" });

      // Clear error state after 3 seconds
      setTimeout(() => {
        setSaveStates((prev) => {
          const updated = { ...prev };
          delete updated[contributionId];
          return updated;
        });
      }, 3000);
    }
  };

  // Flatten contributions with group info (including omitted for review)
  const getFlattenedContributions = (): ContributionWithGroup[] => {
    if (!contributions) return [];

    const flattened: ContributionWithGroup[] = [];
    contributions.groups.forEach((group) => {
      group.contributions.forEach((c) => {
        flattened.push({
          ...c,
          groupName: group.company === "OMITTED" ? "Omitted" : group.company,
        });
      });
    });

    return flattened;
  };

  const renderContributionRow = (contribution: ContributionWithGroup) => {
    const contributionId = getContributionId(contribution);
    const isEditing = editingContribution === contributionId;
    const saveState = saveStates[contributionId];
    const rollup = isRollup(contribution);
    const single = !rollup ? (contribution as SingleContribution) : null;

    // Build full name from components
    const fullName = contribution.redacted
      ? "REDACTED"
      : [
          contribution.contributor_first_name,
          contribution.contributor_middle_name,
          contribution.contributor_last_name,
          contribution.contributor_suffix,
        ]
          .filter(Boolean)
          .join(" ") || contribution.contributor_name || "Unknown";

    return (
      <div
        key={contributionId}
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "5px",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            {/* Header with name and status */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ fontSize: "1.1em" }}>{fullName}</strong>
              <div style={{ marginLeft: "auto" }}>
                <ReviewStatusBadge manualReview={contribution.manualReview} />
              </div>
            </div>

            {/* Primary details */}
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "4px", fontSize: "0.9em", marginBottom: "8px" }}>
              {rollup && (
                <>
                  <span style={{ color: "#666" }}>Type:</span>
                  <span style={{ color: "#856404", fontWeight: "500" }}>
                    Rollup ({contribution.total} contributions)
                  </span>
                </>
              )}

              {contribution.entity_type && (
                <>
                  <span style={{ color: "#666" }}>Entity Type:</span>
                  <span>{contribution.entity_type}</span>
                </>
              )}

              {contribution.contributor_occupation && (
                <>
                  <span style={{ color: "#666" }}>Occupation:</span>
                  <span>{contribution.contributor_occupation}</span>
                </>
              )}

              {contribution.contributor_employer && (
                <>
                  <span style={{ color: "#666" }}>Employer:</span>
                  <span>{contribution.contributor_employer}</span>
                </>
              )}

              {contribution.groupName && (
                <>
                  <span style={{ color: "#666" }}>Group:</span>
                  <span>{contribution.groupName}</span>
                </>
              )}

              {rollup ? (
                <>
                  <span style={{ color: "#666" }}>Date Range:</span>
                  <span>
                    {formatDate(contribution.oldest)} - {formatDate(contribution.newest)}
                  </span>
                  <span style={{ color: "#666" }}>Total Amount:</span>
                  <span style={{ fontWeight: "500" }}>
                    {formatCurrency(contribution.total_receipt_amount)}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ color: "#666" }}>Date:</span>
                  <span>{formatDate(single?.contribution_receipt_date)}</span>
                  <span style={{ color: "#666" }}>Amount:</span>
                  <span style={{ fontWeight: "500" }}>
                    {formatCurrency(single?.contribution_receipt_amount)}
                  </span>
                </>
              )}

              {contribution.contributor_aggregate_ytd && (
                <>
                  <span style={{ color: "#666" }}>Aggregate YTD:</span>
                  <span>{formatCurrency(contribution.contributor_aggregate_ytd)}</span>
                </>
              )}

              {single?.transaction_id && (
                <>
                  <span style={{ color: "#666" }}>Transaction ID:</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.85em" }}>
                    {single.transaction_id}
                  </span>
                </>
              )}

              {single?.receipt_type_full && (
                <>
                  <span style={{ color: "#666" }}>Receipt Type:</span>
                  <span>
                    {single.receipt_type_full}
                    {single.receipt_type && ` (${single.receipt_type})`}
                  </span>
                </>
              )}

              {single?.pdf_url && (
                <>
                  <span style={{ color: "#666" }}>FEC Filing:</span>
                  <span>
                    <a
                      href={single.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      View PDF
                    </a>
                  </span>
                </>
              )}

              {contribution.link && (
                <>
                  <span style={{ color: "#666" }}>Link:</span>
                  <span>
                    <a
                      href={contribution.link}
                      style={{ color: "#007bff", textDecoration: "underline" }}
                    >
                      {contribution.link}
                    </a>
                  </span>
                </>
              )}
            </div>

            {/* Flags */}
            <div style={{ fontSize: "0.85em", marginBottom: "8px" }}>
              {contribution.claimed && (
                <span
                  style={{
                    padding: "2px 6px",
                    backgroundColor: "#d1ecf1",
                    color: "#0c5460",
                    borderRadius: "3px",
                    marginRight: "5px",
                  }}
                >
                  Claimed
                </span>
              )}
              {contribution.redacted && (
                <span
                  style={{
                    padding: "2px 6px",
                    backgroundColor: "#f8d7da",
                    color: "#721c24",
                    borderRadius: "3px",
                    marginRight: "5px",
                  }}
                >
                  Redacted
                </span>
              )}
            </div>

            {/* Current review description */}
            {contribution.description && !isEditing && (
              <div
                style={{
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "#e9ecef",
                  borderRadius: "3px",
                  fontSize: "0.85em",
                  fontStyle: "italic",
                }}
              >
                <strong>Review Note:</strong> {contribution.description}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div style={{ marginTop: "10px", borderTop: "1px solid #ddd", paddingTop: "10px" }}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9em" }}>
                Description (optional):
              </label>
              <textarea
                className={styles.editorTextArea}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                placeholder="Add a note about this contribution..."
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() =>
                  updateContributionReview(contribution, "verified", editDescription)
                }
                disabled={saveState === "pending"}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: saveState === "pending" ? "not-allowed" : "pointer",
                }}
              >
                Mark as Verified
              </button>
              <button
                onClick={() =>
                  updateContributionReview(contribution, "omit", editDescription)
                }
                disabled={saveState === "pending"}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: saveState === "pending" ? "not-allowed" : "pointer",
                }}
              >
                Mark as Omit
              </button>
              <button
                onClick={() => {
                  setEditingContribution(null);
                  setEditDescription("");
                }}
                disabled={saveState === "pending"}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: saveState === "pending" ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                setEditingContribution(contributionId);
                setEditDescription(contribution.description || "");
              }}
              style={{
                padding: "6px 12px",
                fontSize: "0.85em",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Edit Review
            </button>
          </div>
        )}

        {saveState === "success" && (
          <div style={{ marginTop: "5px", color: "#28a745", fontSize: "0.85em" }}>
            ✓ Saved successfully
          </div>
        )}
        {saveState === "error" && (
          <div style={{ marginTop: "5px", color: "#dc3545", fontSize: "0.85em" }}>
            ✗ Error saving
          </div>
        )}
      </div>
    );
  };

  if (!committees) {
    return <div className={styles.container}>Loading committees...</div>;
  }

  const committeeKeys = Object.keys(committees).sort((a, b) =>
    committees[a].name.localeCompare(committees[b].name)
  );

  return (
    <div className={styles.container}>
      <h1>Review Contributions</h1>
      <p>Review and mark contributions as verified or omitted</p>

      <section className={styles.editorCard}>
        <select
          className={styles.editorSelect}
          value={selectedCommitteeId}
          onChange={(e) => setSelectedCommitteeId(e.target.value)}
        >
          <option value="">Select a committee</option>
          {committeeKeys.map((key) => (
            <option key={key} value={key}>
              {committees[key].name}
            </option>
          ))}
        </select>

        {loadingState === "loading" && <p>Loading contributions...</p>}
        {loadingState === "error" && <p>Error loading contributions.</p>}
        {loadingState === "loaded" && contributions && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ marginBottom: "15px", color: "#666" }}>
              Total contributions: {getFlattenedContributions().length}
            </p>
            <div>
              {getFlattenedContributions().map((contribution) =>
                renderContributionRow(contribution)
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
