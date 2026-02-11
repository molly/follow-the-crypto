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
        <div className="banner">
          This website has been updated to track ongoing Congressional activity
          and the 2026 midterm elections. If you are looking for 2024 data,
          please visit{" "}
          <a href="https://www.followthecrypto.org/2024/">
            Follow the Crypto 2024
          </a>
          .
        </div>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
