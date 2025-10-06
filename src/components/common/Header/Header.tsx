import CartIcon from "@/components/icons/CartIcon";
import MenuIcon from "@/components/icons/MenuIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import styles from "./Header.module.css";
import CartBadge from "@/features/cart/CartBadge";
function Header() {
  return (
    <header className={styles.header}>
      {/* Top bar */}
      <div className={styles.topbar}>
        <div className="container d-flex justify-content-between align-items-center">
          <span className={styles.slogan}>
            An online platform <br /> for pre-owned vintage watches
          </span>
          <div className={styles.topRight}>
            <button className={styles.iconBtn}><SearchIcon width={20} height={20} /></button>
            <button className={styles.iconBtn}>👤</button>
            <CartBadge />
          </div>
        </div>
      </div>

      {/* Middle nav */}
      <nav className={styles.navbar}>
        <div className="container">
          <ul className={styles.menu}>
            <li>Home</li>
            <li>Gent Watches</li>
            <li>Lady Watches</li>
            <li>Watch Service</li>
            <li>Accesories</li>
            <li>Terms & Policies</li>
            <li>
              English <span className={styles.flag}>🇺🇸</span>
            </li>
          </ul>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="container breadscrumBar">
        <div className={styles.breadcrumb}>
          <span>HOME</span> / <strong>VINTAGE WATCHES</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;
