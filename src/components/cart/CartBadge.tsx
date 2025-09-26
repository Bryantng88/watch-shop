"use client";

import { useCartContext } from "@/context/CartContext";
import styles from "./CartBadge.module.css"
export default function CartBadge() {
    const { count } = useCartContext();
    const { subtotal } = useCartContext();

    return (

        <button className={styles.wrap} aria-label="Open cart">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden />
            {count > 0 && <span className={styles.badge}>{count > 99 ? "99+" : count}</span>}
        </button>
    );
}