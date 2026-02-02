import { ManualReview } from "@/app/types/Contributions";
import React from "react";

interface ReviewStatusBadgeProps {
  manualReview?: ManualReview;
}

export default function ReviewStatusBadge({ manualReview }: ReviewStatusBadgeProps) {
  if (!manualReview) {
    return (
      <span
        style={{
          padding: "2px 8px",
          borderRadius: "3px",
          fontSize: "0.85em",
          backgroundColor: "#e0e0e0",
          color: "#666",
        }}
      >
        Pending
      </span>
    );
  }

  const isVerified = manualReview.status === "verified";
  const isOmitted = manualReview.status === "omit";

  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: "3px",
        fontSize: "0.85em",
        backgroundColor: isVerified ? "#d4edda" : isOmitted ? "#f8d7da" : "#e0e0e0",
        color: isVerified ? "#155724" : isOmitted ? "#721c24" : "#666",
      }}
    >
      {isVerified ? "Verified" : isOmitted ? "Omitted" : "Pending"}
    </span>
  );
}
