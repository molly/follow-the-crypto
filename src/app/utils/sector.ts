export type Sector = "all" | "crypto" | "ai";

const SECTOR_LABELS: Record<Sector, string> = {
  all: "Cryptocurrency and artificial intelligence",
  crypto: "Cryptocurrency",
  ai: "Artificial intelligence",
};

const SECTOR_LABELS_ABBREV: Record<Sector, string> = {
  all: "Crypto and AI",
  crypto: "Crypto",
  ai: "AI",
};

interface HumanizeSectorOptions {
  context?: "industry";
  abbrev?: boolean;
  lowercase?: boolean;
}

export function humanizeSector(
  sector: Sector,
  options?: HumanizeSectorOptions,
): string {
  let label = options?.abbrev
    ? SECTOR_LABELS_ABBREV[sector]
    : SECTOR_LABELS[sector];
  label = options?.lowercase ? label.toLowerCase() : label;
  if (options?.context === "industry" && sector !== "all") {
    return `${label} industry`;
  }
  return label;
}

export function parseSector(value: string | undefined): Sector {
  if (value === "crypto" || value === "ai") {
    return value;
  }
  return "all";
}
