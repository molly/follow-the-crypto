import Logo from "@/app/components/Logo";
import headerStyles from "@/app/components/header.module.css";
import sharedStyles from "@/app/shared.module.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <header className={headerStyles.header}>
        <Logo />
      </header>
      <main className={sharedStyles.mainLayout}>
        <h1 className={sharedStyles.title}>404</h1>
        <div>
          Page not found. <Link href="/">Go back home?</Link>
        </div>
      </main>
    </>
  );
}
