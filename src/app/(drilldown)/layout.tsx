import Logo from "@/app/components/Logo";
import "@/app/globals.css";
import sharedStyles from "@/app/shared.module.css";

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
