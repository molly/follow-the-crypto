import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "../../globals.css";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Follow the Crypto",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header>
        <div className={styles.logo}>
          <Link href="/">↓ Follow the Crypto</Link>
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </>
  );
}
