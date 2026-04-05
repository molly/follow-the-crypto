"use client";
import { useSector, type Sector } from "@/app/context/SectorContext";
import styles from "./header.module.css";

const SECTORS: { label: string; value: Sector }[] = [
  { label: "All", value: "all" },
  { label: "Crypto", value: "crypto" },
  { label: "AI", value: "ai" },
];

export default function SectorButtons() {
  const { sector, setSector } = useSector();

  return (
    <>
      {SECTORS.map(({ label, value }) => (
        <button
          key={value}
          className={`${styles.sector} ${sector === value ? styles.sectorActive : ""}`}
          onClick={() => setSector(value)}
        >
          {label}
        </button>
      ))}
    </>
  );
}
