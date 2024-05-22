import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";

export const revalidate = 3600;
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
        <main className={styles.mainGrid}>{children}</main>
      </body>
    </html>
  );
}
