"use client";

import { useCartUI } from "@/features/cart/context/cart-UI-context";
import { useCartContext } from "@/features/cart/context/cart-data-context";

import styles from "./CartBadge.module.css"
export default function CartBadge() {
    const { count } = useCartContext();
    const { subtotal } = useCartContext();
    const { openCart } = useCartUI();

    return (

        <button onClick={openCart} className={styles.wrap} aria-label="Open cart">
            Open Cart
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden />
            {count > 0 && <span className={styles.badge}>{count > 99 ? "99+" : count}</span>}
        </button>
    );
}