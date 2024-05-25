import Link from "next/link";
import sharedStyles from "../shared.module.css";

export default function Logo() {
  return (
    <header className={sharedStyles.fullWidth}>
      <div className={sharedStyles.logo}>
        <Link className={sharedStyles.logoText} href="/">
          ↓ Follow the Crypto
        </Link>
      </div>
    </header>
  );
}
