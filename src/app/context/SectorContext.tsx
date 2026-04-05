"use client";

import { createContext, useContext, useState } from "react";

export type Sector = "all" | "crypto" | "ai";

type SectorContextType = {
  sector: Sector;
  setSector: (sector: Sector) => void;
};

const SectorContext = createContext<SectorContextType | null>(null);

export function SectorProvider({ children }: { children: React.ReactNode }) {
  const [sector, setSector] = useState<Sector>("all");

  return (
    <SectorContext.Provider value={{ sector, setSector }}>
      {children}
    </SectorContext.Provider>
  );
}

export function useSector() {
  const context = useContext(SectorContext);
  if (!context) {
    throw new Error("useSector must be used within a SectorProvider");
  }
  return context;
}
