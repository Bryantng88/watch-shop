import { useCartContext } from "@/context/CartContext";

export const useCart = () => {
    const { items, addToCart, removeFromCart, clearCart, total } = useCartContext();
    return { items, addToCart, removeFromCart, clearCart, total };
};