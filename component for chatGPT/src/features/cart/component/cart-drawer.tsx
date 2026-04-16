"use client";

import { useCartContext } from "@/features/cart/context/cart-data-context";
import { useCartUI } from "@/features/cart/context/cart-UI-context";
import { useEffect } from "react";
import styles from "./CartDrawer.module.css";
export default function CartDrawer() {
    const { isOpen, closeCart } = useCartUI();
    const { items, subtotal, setQty, removeFromCart, clearCart } = useCartContext();

    // Khóa cuộn body khi mở drawer (UX tốt hơn)
    useEffect(() => {
        if (isOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = prev; };
        }
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
                onClick={closeCart}
            />
            <aside
                role="dialog"
                aria-modal="true"
                className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* nội dung giỏ hàng */}
            </aside>
        </>
    );
}
