import Logo from "@/app/components/Logo";
import { titlecase } from "@/app/utils/titlecase";
import type { Metadata } from "next";
import "../../globals.css";
import sharedStyles from "../../shared.module.css";

export async function generateMetadata({
  params,
}: {
  params: { state: string };
}): Promise<Metadata> {
  return {
    title: `${titlecase(params.state.split("-").join(" "))} | Follow the Crypto`,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Logo />
      <main className={sharedStyles.mainGrid}>{children}</main>
    </>
  );
}
