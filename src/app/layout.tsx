import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";
import { BASE_METADATA } from "./utils/metadata";

export const revalidate = 3600;
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = BASE_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="me" href="https://hachyderm.io/@followthecrypto" />
      </head>
      <body className={sourceSans.className}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
