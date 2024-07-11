import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export const revalidate = 0;
const inter = Source_Sans_3({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={inter.className}>
        <Sidebar />
        {children}
      </body>
    </html>
  );
}
