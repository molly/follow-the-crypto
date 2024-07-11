"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import styles from "./sidebar.module.css";

function LeftArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={styles.collapseIcon}
    >
      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={styles.collapseIcon}
    >
      <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
    </svg>
  );
}

export default function Sidebar() {
  const [isCollapsed, setCollapsed] = useState(true);

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { duration: 0.2, ease: "easeInOut", staggerChildren: 0.05 },
    },
    closed: { x: "-100%", transition: { duration: 0.2, ease: "easeInOut" } },
  };

  const itemVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const buttonVariants = {
    open: { left: "unset", right: "1rem" },
    closed: { left: "1rem", right: "unset" },
  };

  return (
    <>
      <motion.aside
        animate={isCollapsed ? "closed" : "open"}
        variants={sidebarVariants}
        initial="closed"
        className={styles.sidebarContainer}
      >
        <nav className={styles.sidebarContent}>
          <div className={styles.logoAndCollapse}>
            <span className={styles.logo}>Follow the Crypto</span>
            <button
              className={styles.collapseButton}
              title="Expand sidebar"
              onClick={() => setCollapsed(true)}
            >
              <LeftArrowIcon />
            </button>
          </div>
          <ul className={styles.sidebarList}>
            <motion.li variants={itemVariants} className={styles.sidebarHeader}>
              Spending
            </motion.li>
            <motion.li
              variants={itemVariants}
              className={styles.sidebarListItem}
            >
              <Link
                className={styles.sidebarLink}
                onClick={() => setCollapsed(true)}
                href="/committees"
              >
                By cryptocurrency-focused committees
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className={styles.sidebarListItem}
            >
              <Link
                className={styles.sidebarLink}
                onClick={() => setCollapsed(true)}
                href="/companies"
              >
                By companies
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className={styles.sidebarListItem}
            >
              <Link
                className={styles.sidebarLink}
                onClick={() => setCollapsed(true)}
                href="/individuals"
              >
                By individuals
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className={styles.sidebarListItem}
            >
              <Link
                className={styles.sidebarLink}
                onClick={() => setCollapsed(true)}
                href="/expenditures"
              >
                Most recent expenditures
              </Link>
            </motion.li>
            <motion.li variants={itemVariants} className={styles.sidebarHeader}>
              Elections
            </motion.li>
            <motion.li
              variants={itemVariants}
              className={styles.sidebarListItem}
            >
              <Link
                className={styles.sidebarLink}
                onClick={() => setCollapsed(true)}
                href="/states"
              >
                By state
              </Link>
            </motion.li>
            <motion.li
              variants={itemVariants}
              className={styles.sidebarListItem}
            >
              <Link
                className={styles.sidebarLink}
                onClick={() => setCollapsed(true)}
                href="/races"
              >
                All races
              </Link>
            </motion.li>
          </ul>
        </nav>
      </motion.aside>
      <button
        className={styles.floatingCollapseButton}
        title="Expand sidebar"
        onClick={() => setCollapsed(false)}
      >
        <HamburgerIcon />
      </button>
    </>
  );
}
