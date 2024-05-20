import Logo from "@/app/components/Logo";
import { Committee } from "@/app/types/Committee";
import { getConstant } from "@/app/utils/constants";
import type { Metadata } from "next";
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

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Logo />
      <main className={styles.main}>{children}</main>
    </>
  );
}
