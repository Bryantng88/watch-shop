import CartIcon from "../icons/CartIcon";
import MenuIcon from "../icons/MenuIcon";
import SearchIcon from "../icons/SearchIcon";
import styles from "./Header.module.css";
function Header() {
  return (
    /*<header className="bg-white position-absolute top-0 start-0 w-100 p-3">
      <div className="container d-flex justify-content-between">
        <div className="d-flex align-items-center justify-content-center">
          <MenuIcon />
        </div>
        <div className="logo d-flex align-items-center">
          <img 
            src="https://thevintage.watch/cdn/shop/files/The_Vintage_Watch_Collection_Final_600.png?v=1704147196&width=300" 
            alt="The Vintage Watch Collection Logo"
            className="img-fluid"
            style={{ width: '150px' }}
          />
        </div>
        <div className="d-flex gap-2">
          <div className="d-flex align-items-center justify-content-center">
            <CartIcon width={40} height={40} />
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <SearchIcon width={20} height={20} />
          </div>
        </div>
      </div>
    </header>*/
    <header className={styles.header}>
      {/* Top bar */}
      <div className={styles.topbar}>
        <span className={styles.slogan}>
          An online platform <br /> for pre-owned vintage watches
        </span>
        <div className={styles.topRight}>
          <button className={styles.iconBtn}>🔍</button>
          <button className={styles.iconBtn}>👤</button>
          <span className={styles.cart}>0 VND <span className={styles.cartBox}>0</span></span>
        </div>
      </div>

      {/* Middle nav */}
      <nav className={styles.navbar}>
        <ul className={styles.menu}>
          <li>Articles</li>
          <li>Vintage Watches</li>
          <li>Affordable Vintage Watches</li>
          <li>Terms & Policies</li>
          <li>
            English <span className={styles.flag}>🇺🇸</span>
          </li>
        </ul>
      </nav>

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <span>HOME</span> / <strong>ĐỒNG HỒ VINTAGE</strong>
      </div>
    </header>
  );
}

export default Header;