"use client";
import { CartProvider } from "@/features/cart/context/cart-data-context";
import { CartUIProvider } from "@/features/cart/context/cart-UI-context";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <CartUIProvider>
                {children}
            </CartUIProvider>
        </CartProvider>
    )
}