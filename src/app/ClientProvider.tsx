"use client";
import { CartProvider } from "@/context/CartContext";
import { CartUIProvider } from "@/context/CartUIContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <CartUIProvider>
                {children}
            </CartUIProvider>
        </CartProvider>
    )
}