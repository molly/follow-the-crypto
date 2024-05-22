import Logo from "@/app/components/Logo";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Logo />
      {children}
    </>
  );
}
