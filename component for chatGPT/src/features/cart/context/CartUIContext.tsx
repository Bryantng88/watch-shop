"use client";
import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import type { CartItem, CartState, AddToCartInput } from "@/types/cart";

type CartUIContextType = {
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
};

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export function CartUIProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const toggleCart = () => setIsOpen((v) => !v);

    // Đóng bằng phím ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <CartUIContext.Provider value={{ isOpen, openCart, closeCart, toggleCart }}>
            {children}
        </CartUIContext.Provider>
    );
}

export function useCartUI() {
    const ctx = useContext(CartUIContext);
    if (!ctx) throw new Error("useCartUI must be used inside <CartUIProvider />");
    return ctx;
}