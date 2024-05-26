import sharedStyles from "@/app/shared.module.css";
import AuthProvider from "./AuthProvider";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <main className={sharedStyles.mainGrid}>{children}</main>
    </AuthProvider>
  );
}
