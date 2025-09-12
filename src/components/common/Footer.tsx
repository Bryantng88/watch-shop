import Link from "next/link";
import CartIcon from "../icons/CartIcon";
import SearchIcon from "../icons/SearchIcon";
import styles from "../../styles/common/footer.module.css"

function Footer() {
    return (
      <>
        <footer className="bg-black text-white py-5 mx-5">
            <div className="mx-5">
                <div className="d-flex justify-content-center gap-4 ">
                    <Link href="#">Home</Link>
                    <Link href="#">Available Watches</Link>
                    <Link href="#">Recently Sold</Link>
                    <Link href="#">FAQ</Link>
                    <Link href="#">About Us</Link>
                    <Link href="#">Contact</Link>
                </div>
                <div className="mt-4 d-flex justify-content-between">
                    <div>
                        <h5 className={`${styles.headerFooter}`} >Subscribe to our monthly watch drop:</h5>
                        <input type="email" name="email" />
                    </div>
                    <div>
                        <div className="d-flex gap-2">
                            <div className="d-flex align-items-center justify-content-center">
                                <CartIcon width={40} height={40} color="#ffffff" />
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <SearchIcon width={20} height={20} color="#ffffff" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p>© 2025 My Shop. All rights reserved.</p>
            </div>
        </footer>
      </>
    );
  }
  
  export default Footer;