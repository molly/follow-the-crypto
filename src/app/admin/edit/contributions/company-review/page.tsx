"use client";

import ReviewStatusBadge from "@/app/components/ReviewStatusBadge";
import { db } from "@/app/lib/db";
import { CompanyConstant } from "@/app/types/Companies";
import {
  IndividualOrCompanyContribution,
  IndividualOrCompanyContributionGroup,
  ManualReview,
} from "@/app/types/Contributions";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styles from "../../../../admin/admin.module.css";

type CompanyData = {
  contributions?: IndividualOrCompanyContributionGroup[];
  [key: string]: unknown;
};

type ContributionWithCommittee = IndividualOrCompanyContribution & {
  _committeeId: string;
  _committeeName?: string;
  _groupIndex: number;
  _contribIndex: number;
};

function getUniqueKey(contribution: ContributionWithCommittee): string {
  return `${getContributionId(contribution)}_${contribution._groupIndex}_${contribution._contribIndex}`;
}

// Generate contribution ID matching Python backend logic
function getContributionId(contribution: IndividualOrCompanyContribution): string {
  if (contribution.total !== undefined && contribution.oldest !== undefined) {
    // Rollup
    const name = contribution.contributor_name || "";
    const amount = contribution.total_receipt_amount || 0;
    const date = contribution.oldest || "";
    return `rollup_${name}_${amount}_${date}`;
  } else {
    return `txn_${contribution.transaction_id}`;
  }
}

function formatCurrency(amount?: number | null): string {
  if (amount === undefined || amount === null) {
    return "$0";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) {
    return "";
  }
  try {
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

function countUnreviewed(groups: IndividualOrCompanyContributionGroup[]): {
  total: number;
  unreviewed: number;
} {
  let total = 0;
  let unreviewed = 0;
  for (const group of groups) {
    for (const c of group.contributions) {
      total++;
      if (!c.manualReview) {
        unreviewed++;
      }
    }
  }
  return { total, unreviewed };
}

export default function CompanyContributionReviewPage() {
  const [companies, setCompanies] = useState<Record<
    string,
    CompanyConstant
  > | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loadingState, setLoadingState] = useState<
    "idle" | "loading" | "loaded" | "error"
  >("idle");
  const [saveStates, setSaveStates] = useState<Record<string, string>>({});
  const [editingContribution, setEditingContribution] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [reviewCounts, setReviewCounts] = useState<
    Record<string, { total: number; unreviewed: number }>
  >({});
  const [bulkSaveState, setBulkSaveState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [bulkOmitState, setBulkOmitState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");

  // Load company constants and review counts on mount
  useEffect(() => {
    (async () => {
      try {
        const constantsDoc = await getDoc(doc(db, "constants", "companies"));
        if (!constantsDoc.exists()) {
          console.error("No company constants found");
          return;
        }
        setCompanies(constantsDoc.data() as Record<string, CompanyConstant>);
      } catch (error) {
        console.error("Error loading company constants:", error);
        return;
      }

      // Fetch all company docs to compute per-company review counts
      try {
        const snapshot = await getDocs(collection(db, "companies"));
        const counts: Record<string, { total: number; unreviewed: number }> = {};
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as CompanyData;
          if (data.contributions) {
            counts[docSnap.id] = countUnreviewed(data.contributions);
          } else {
            counts[docSnap.id] = { total: 0, unreviewed: 0 };
          }
        });
        setReviewCounts(counts);
      } catch (error) {
        console.error("Error loading review counts:", error);
      }
    })();
  }, []);

  // Load company data when a company is selected
  useEffect(() => {
    if (!selectedCompanyId) {
      setCompanyData(null);
      return;
    }

    (async () => {
      setLoadingState("loading");
      try {
        const docRef = doc(db, "companies", selectedCompanyId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setCompanyData(snapshot.data() as CompanyData);
          setLoadingState("loaded");
        } else {
          setLoadingState("error");
        }
      } catch (error) {
        console.error("Error loading company:", error);
        setLoadingState("error");
      }
    })();
  }, [selectedCompanyId]);

  const updateContributionReview = async (
    contribution: ContributionWithCommittee,
    status: "verified" | "omit",
    description: string,
  ) => {
    if (!selectedCompanyId || !companyData?.contributions) {
      return;
    }

    const uniqueKey = getUniqueKey(contribution);
    setSaveStates({ ...saveStates, [uniqueKey]: "pending" });

    const manualReview: ManualReview = {
      reviewed: true,
      status,
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedGroups: IndividualOrCompanyContributionGroup[] =
        companyData.contributions.map((group, gi) => ({
          ...group,
          contributions: group.contributions.map((c, ci) => {
            if (gi === contribution._groupIndex && ci === contribution._contribIndex) {
              return {
                ...c,
                manualReview,
                ...(description && { description }),
              };
            }
            return c;
          }),
        }));

      const docRef = doc(db, "companies", selectedCompanyId);
      await updateDoc(docRef, { contributions: updatedGroups });

      setCompanyData({ ...companyData, contributions: updatedGroups });

      if (!contribution.manualReview) {
        setReviewCounts((prev) => ({
          ...prev,
          [selectedCompanyId]: {
            total: prev[selectedCompanyId]?.total || 0,
            unreviewed: Math.max(0, (prev[selectedCompanyId]?.unreviewed || 0) - 1),
          },
        }));
      }

      setSaveStates({ ...saveStates, [uniqueKey]: "success" });
      setEditingContribution(null);
      setEditDescription("");

      setTimeout(() => {
        setSaveStates((prev) => {
          const updated = { ...prev };
          delete updated[uniqueKey];
          return updated;
        });
      }, 2000);
    } catch (error) {
      console.error("Error updating contribution:", error);
      setSaveStates({ ...saveStates, [uniqueKey]: "error" });

      setTimeout(() => {
        setSaveStates((prev) => {
          const updated = { ...prev };
          delete updated[uniqueKey];
          return updated;
        });
      }, 3000);
    }
  };

  const markAllAsVerified = async () => {
    if (!selectedCompanyId || !companyData?.contributions) {
      return;
    }
    if (
      !window.confirm(
        "Mark all unreviewed contributions for this company as verified?",
      )
    ) {
      return;
    }

    setBulkSaveState("pending");

    const manualReview: ManualReview = {
      reviewed: true,
      status: "verified",
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedGroups: IndividualOrCompanyContributionGroup[] =
        companyData.contributions.map((group) => ({
          ...group,
          contributions: group.contributions.map((c) =>
            c.manualReview ? c : { ...c, manualReview },
          ),
        }));

      const docRef = doc(db, "companies", selectedCompanyId);
      await updateDoc(docRef, { contributions: updatedGroups });

      setCompanyData({ ...companyData, contributions: updatedGroups });
      setReviewCounts((prev) => ({
        ...prev,
        [selectedCompanyId]: {
          total: prev[selectedCompanyId]?.total || 0,
          unreviewed: 0,
        },
      }));
      setBulkSaveState("success");
      setTimeout(() => setBulkSaveState("idle"), 2000);
    } catch (error) {
      console.error("Error marking all as verified:", error);
      setBulkSaveState("error");
      setTimeout(() => setBulkSaveState("idle"), 3000);
    }
  };

  const markAllAsOmit = async () => {
    if (!selectedCompanyId || !companyData?.contributions) {
      return;
    }
    if (
      !window.confirm(
        "Mark all unreviewed contributions for this company as omit?",
      )
    ) {
      return;
    }

    setBulkOmitState("pending");

    const manualReview: ManualReview = {
      reviewed: true,
      status: "omit",
      reviewed_at: new Date().toISOString(),
    };

    try {
      const updatedGroups: IndividualOrCompanyContributionGroup[] =
        companyData.contributions.map((group) => ({
          ...group,
          contributions: group.contributions.map((c) =>
            c.manualReview ? c : { ...c, manualReview },
          ),
        }));

      const docRef = doc(db, "companies", selectedCompanyId);
      await updateDoc(docRef, { contributions: updatedGroups });

      setCompanyData({ ...companyData, contributions: updatedGroups });
      setReviewCounts((prev) => ({
        ...prev,
        [selectedCompanyId]: {
          total: prev[selectedCompanyId]?.total || 0,
          unreviewed: 0,
        },
      }));
      setBulkOmitState("success");
      setTimeout(() => setBulkOmitState("idle"), 2000);
    } catch (error) {
      console.error("Error marking all as omit:", error);
      setBulkOmitState("error");
      setTimeout(() => setBulkOmitState("idle"), 3000);
    }
  };

  const getFlattenedContributions = (): ContributionWithCommittee[] => {
    if (!companyData?.contributions) {
      return [];
    }

    const flattened: ContributionWithCommittee[] = [];
    companyData.contributions.forEach((group, gi) => {
      group.contributions.forEach((c, ci) => {
        flattened.push({
          ...c,
          _committeeId: group.committee_id,
          _committeeName: c.committee_name,
          _groupIndex: gi,
          _contribIndex: ci,
        });
      });
    });
    flattened.sort((a, b) => {
      if (!a.manualReview && b.manualReview) return -1;
      if (a.manualReview && !b.manualReview) return 1;
      return 0;
    });

    return flattened;
  };

  const renderContributionRow = (contribution: ContributionWithCommittee) => {
    const contributionId = getUniqueKey(contribution);
    const isEditing = editingContribution === contributionId;
    const saveState = saveStates[contributionId];
    const isRollup =
      contribution.total !== undefined && contribution.oldest !== undefined;

    const contributorLabel =
      contribution.contributor_name ||
      [contribution.contributor_first_name, contribution.contributor_last_name]
        .filter(Boolean)
        .join(" ") ||
      "Unknown";

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1 }}>
            {/* Header with name and status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <strong style={{ fontSize: "1.1em" }}>{contributorLabel}</strong>
              <div style={{ marginLeft: "auto" }}>
                <ReviewStatusBadge manualReview={contribution.manualReview} />
              </div>
            </div>

            {/* Details grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: "4px",
                fontSize: "0.9em",
                marginBottom: "8px",
              }}
            >
              {isRollup && (
                <>
                  <span style={{ color: "#666" }}>Type:</span>
                  <span style={{ color: "#856404", fontWeight: "500" }}>
                    Rollup ({contribution.total} contributions)
                  </span>
                </>
              )}

              {contribution.isIndividual && contribution.individual && (
                <>
                  <span style={{ color: "#666" }}>Individual:</span>
                  <span>{contribution.individual}</span>
                </>
              )}

              <span style={{ color: "#666" }}>Recipient:</span>
              <span>
                {contribution._committeeName || contribution._committeeId}
              </span>

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

              {isRollup ? (
                <>
                  <span style={{ color: "#666" }}>Date Range:</span>
                  <span>
                    {formatDate(contribution.oldest)} –{" "}
                    {formatDate(contribution.newest)}
                  </span>
                  <span style={{ color: "#666" }}>Total Amount:</span>
                  <span style={{ fontWeight: "500" }}>
                    {formatCurrency(contribution.total_receipt_amount)}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ color: "#666" }}>Date:</span>
                  <span>
                    {formatDate(contribution.contribution_receipt_date)}
                  </span>
                  <span style={{ color: "#666" }}>Amount:</span>
                  <span style={{ fontWeight: "500" }}>
                    {formatCurrency(contribution.contribution_receipt_amount)}
                  </span>
                </>
              )}

              {contribution.contributor_aggregate_ytd && (
                <>
                  <span style={{ color: "#666" }}>Aggregate YTD:</span>
                  <span>
                    {formatCurrency(contribution.contributor_aggregate_ytd)}
                  </span>
                </>
              )}

              {contribution.transaction_id && (
                <>
                  <span style={{ color: "#666" }}>Transaction ID:</span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.85em" }}>
                    {contribution.transaction_id}
                  </span>
                </>
              )}

              {contribution.receipt_type_full && (
                <>
                  <span style={{ color: "#666" }}>Receipt Type:</span>
                  <span>
                    {contribution.receipt_type_full}
                    {contribution.receipt_type &&
                      ` (${contribution.receipt_type})`}
                  </span>
                </>
              )}

              {contribution.memo_text && (
                <>
                  <span style={{ color: "#666" }}>Memo:</span>
                  <span>{contribution.memo_text}</span>
                </>
              )}

              {contribution.pdf_url && (
                <>
                  <span style={{ color: "#666" }}>FEC Filing:</span>
                  <span>
                    <a
                      href={contribution.pdf_url}
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
              {contribution.isIndividual && (
                <span
                  style={{
                    padding: "2px 6px",
                    backgroundColor: "#e2d9f3",
                    color: "#4a235a",
                    borderRadius: "3px",
                    marginRight: "5px",
                  }}
                >
                  Individual
                </span>
              )}
            </div>

            {/* Review note */}
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
          <div
            style={{
              marginTop: "10px",
              borderTop: "1px solid #ddd",
              paddingTop: "10px",
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "5px",
                  fontSize: "0.9em",
                }}
              >
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
          <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
            <button
              onClick={() => updateContributionReview(contribution, "verified", "")}
              disabled={saveState === "pending"}
              style={{
                padding: "6px 12px",
                fontSize: "0.85em",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: saveState === "pending" ? "not-allowed" : "pointer",
              }}
            >
              Verify
            </button>
            <button
              onClick={() => updateContributionReview(contribution, "omit", "")}
              disabled={saveState === "pending"}
              style={{
                padding: "6px 12px",
                fontSize: "0.85em",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: saveState === "pending" ? "not-allowed" : "pointer",
              }}
            >
              Omit
            </button>
            <button
              onClick={() => {
                setEditingContribution(contributionId);
                setEditDescription(contribution.description || "");
              }}
              style={{
                padding: "6px 12px",
                fontSize: "0.85em",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Edit / Add Note
            </button>
          </div>
        )}

        {saveState === "success" && (
          <div
            style={{ marginTop: "5px", color: "#28a745", fontSize: "0.85em" }}
          >
            ✓ Saved successfully
          </div>
        )}
        {saveState === "error" && (
          <div
            style={{ marginTop: "5px", color: "#dc3545", fontSize: "0.85em" }}
          >
            ✗ Error saving
          </div>
        )}
      </div>
    );
  };

  if (!companies) {
    return <div className={styles.container}>Loading companies...</div>;
  }

  // Sort: companies with unreviewed contributions first, then alphabetical
  const companyKeys = Object.keys(companies).sort((a, b) => {
    const aUnreviewed = reviewCounts[a]?.unreviewed || 0;
    const bUnreviewed = reviewCounts[b]?.unreviewed || 0;
    if (aUnreviewed > 0 && bUnreviewed === 0) {
      return -1;
    }
    if (aUnreviewed === 0 && bUnreviewed > 0) {
      return 1;
    }
    return companies[a].name.localeCompare(companies[b].name);
  });

  const flattened = getFlattenedContributions();

  return (
    <div className={styles.container}>
      <h1>Review Company Contributions</h1>
      <p>Review and mark company contributions as verified or omitted</p>

      <section className={styles.editorCard}>
        <select
          className={styles.editorSelect}
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
        >
          <option value="">Select a company</option>
          {companyKeys.map((key) => {
            const counts = reviewCounts[key];
            const unreviewed = counts?.unreviewed || 0;
            return (
              <option key={key} value={key}>
                {unreviewed > 0
                  ? `* ${companies[key].name} (${unreviewed} unreviewed)`
                  : companies[key].name}
              </option>
            );
          })}
        </select>

        {loadingState === "loading" && <p>Loading contributions...</p>}
        {loadingState === "error" && <p>Error loading company data.</p>}
        {loadingState === "loaded" && companyData && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                marginBottom: "15px",
              }}
            >
              <p style={{ color: "#666", margin: 0 }}>
                Total contributions: {flattened.length}
              </p>
              {flattened.some((c) => !c.manualReview) && (
                <button
                  onClick={markAllAsVerified}
                  disabled={bulkSaveState === "pending"}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.85em",
                    backgroundColor:
                      bulkSaveState === "success" ? "#28a745" : "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor:
                      bulkSaveState === "pending" ? "not-allowed" : "pointer",
                  }}
                >
                  {bulkSaveState === "pending"
                    ? "Saving..."
                    : bulkSaveState === "success"
                      ? "All verified!"
                      : "Mark all unreviewed as verified"}
                </button>
              )}
              {bulkSaveState === "error" && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  Error saving — please try again
                </span>
              )}
              {flattened.some((c) => !c.manualReview) && (
                <button
                  onClick={markAllAsOmit}
                  disabled={bulkOmitState === "pending"}
                  style={{
                    padding: "6px 14px",
                    fontSize: "0.85em",
                    backgroundColor:
                      bulkOmitState === "success" ? "#28a745" : "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor:
                      bulkOmitState === "pending" ? "not-allowed" : "pointer",
                  }}
                >
                  {bulkOmitState === "pending"
                    ? "Saving..."
                    : bulkOmitState === "success"
                      ? "All omitted!"
                      : "Omit all unreviewed"}
                </button>
              )}
              {bulkOmitState === "error" && (
                <span style={{ color: "#dc3545", fontSize: "0.85em" }}>
                  Error saving — please try again
                </span>
              )}
            </div>
            <div>
              {flattened.map((contribution) =>
                renderContributionRow(contribution),
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
