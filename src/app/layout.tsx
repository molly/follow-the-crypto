import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export const revalidate = 0;
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Follow the Crypto",
  description:
    "Follow the cryptocurrency industry's influence on 2024 elections in the United States.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sourceSans.className}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
