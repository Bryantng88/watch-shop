"use client";
import { CartProvider } from "@/features/cart/context/CartDataContext";
import { CartUIProvider } from "@/features/cart/context/CartUIContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <CartProvider>
            <CartUIProvider>
                {children}
            </CartUIProvider>
        </CartProvider>
    )
}