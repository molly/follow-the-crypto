import { Committee } from "@/app/types/Committee";
import { getConstant } from "@/app/utils/constants";
import type { Metadata } from "next";
import Link from "next/link";
import "../../globals.css";
import styles from "./layout.module.css";

export async function generateMetadata({
  params,
}: {
  params: { committeeId: string };
}): Promise<Metadata> {
  const COMMITTEES: Record<string, Committee> | null =
    await getConstant("committees");
  if (!COMMITTEES || !COMMITTEES[params.committeeId]) {
    return {
      title: "Follow the Crypto",
    };
  }
  const committeeName = COMMITTEES[params.committeeId].name;
  return {
    title: `${committeeName} | Follow the Crypto`,
  };
}

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
