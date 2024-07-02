"use client";

import styles from "@/app/components/tables.module.css";
import useFade from "@/app/hooks/useFade";
import { motion, useScroll } from "framer-motion";
import { useRef } from "react";

export default function OverflowSection({
  children,
  fullPage = false,
  headerHeight = "0",
}: {
  children: React.ReactNode;
  fullPage?: boolean;
  headerHeight?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const fade = useFade(scrollYProgress, headerHeight);

  return (
    <motion.div
      className={fullPage ? styles.noOverflow : styles.overflowWrapper}
      ref={containerRef}
      style={{
        maskImage: fullPage ? undefined : fade,
      }}
    >
      {children}
    </motion.div>
  );
}
