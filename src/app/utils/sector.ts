import { CommitteeConstant } from "../types/Committee";
import { CompanyConstant } from "../types/Companies";
import { BESector, Sector } from "../types/Sector";

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
  hyphen?: boolean;
}

export function humanizeSector(
  sector: Sector,
  options?: HumanizeSectorOptions,
): string {
  if (!sector) {
    return "";
  }
  let label = options?.abbrev
    ? SECTOR_LABELS_ABBREV[sector]
    : SECTOR_LABELS[sector];
  if (options?.lowercase) {
    label = options?.abbrev
      ? label.replace(/\b(?!AI\b)\w+/g, (w) => w.toLowerCase())
      : label.toLowerCase();
  }
  if (options?.context === "industry") {
    label = `${label} industry`;
  }
  if (options?.hyphen) {
    if (sector === "all") {
      return label.replace(" and ", "- and ") + "-";
    }
    return `${label}-`;
  }
  return label;
}

export function parseSector(value: string | undefined): Sector {
  if (value === "crypto" || value === "ai") {
    return value;
  }
  return "all";
}

export function sectorHref(path: string, sector: Sector): string {
  if (sector === "all") {
    return path;
  }
  return `${path}?sector=${sector}`;
}

/**
 * Backend sector "tech" means the entity spans all sectors and should appear
 * in both "crypto" and "ai" filtered views.
 */
function matchesSector(entitySector: BESector | undefined, sector: Sector): boolean {
  if (entitySector === "tech") {
    return true; // tech appears in all sector views
  }
  return entitySector === (sector as BESector);
}

export function getCommitteeIdsForSector(
  sector: Sector,
  committeeConstants: Record<string, CommitteeConstant>,
): Set<string> | null {
  if (sector === "all") {
    return null;
  }
  return new Set(
    Object.entries(committeeConstants)
      .filter(([, c]) => matchesSector(c.sector, sector))
      .map(([id]) => id),
  );
}

export function getCompanyIdsForSector(
  sector: Sector,
  companyConstants: Record<string, CompanyConstant>,
): Set<string> | null {
  if (sector === "all") {
    return null;
  }
  return new Set(
    Object.entries(companyConstants)
      .filter(([, c]) => matchesSector(c.sector, sector))
      .map(([id]) => id),
  );
}
