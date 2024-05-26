import Logo from "./Logo";
import Navbar from "./Navbar";
import styles from "./header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Logo />
      <Navbar />
    </header>
  );
}
