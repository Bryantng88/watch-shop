"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from "react";
import type { CartItem, CartState, AddToCartInput } from "@/types/cart";

type CartContextType = {
    items: CartItem[];
    count: number;
    subtotal: number;
    addToCart: (input: AddToCartInput) => void;
    removeFromCart: (id: CartItem["id"]) => void;
    clearCart: () => void;
    setQty: (id: CartItem["id"], quantity: number) => void;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cart:v1";

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<CartState>({ items: [] });
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setState(JSON.parse(raw));
        } catch { }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const addToCart = (input: AddToCartInput) => {
        setState((prev) => {
            const quantity = input.quantity ?? 1;
            const idx = prev.items.findIndex(i => i.id === input.id);
            if (idx > -1) {
                const items = [...prev.items];
                items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
                return { items }
            }
            return { items: [...prev.items, { ...input, quantity }] };

        }
        )
    }
    const removeFromCart = (id: CartItem["id"]) => {
        setState(prev => ({ items: prev.items.filter(i => i.id !== id) }));
    };

    const clearCart = () => setState({ items: [] });
    const setQty = (id: CartItem["id"], quantity: number) =>
        setState(prev => ({
            items: prev.items.map(i => (i.id === id ? { ...i, quantity } : i)),
        }));

    const count = useMemo(
        () => state.items.reduce((s, i) => s + i.quantity, 0),
        [state.items]
    );

    const subtotal = useMemo(
        () => state.items.reduce((s, i) => s + i.quantity * i.price, 0),
        [state.items]
    );

    const value = useMemo(
        () => ({ items: state.items, count, subtotal, addToCart, removeFromCart, clearCart, setQty }),
        [state.items, count, subtotal]
    );
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}


export function useCartContext() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCartContext must be used inside CartProvider");
    return ctx;
}


