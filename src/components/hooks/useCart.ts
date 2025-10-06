import { useCartContext } from "@/features/cart/context/CartDataContext";

export const useCart = () => {
    const { items, addToCart, removeFromCart, clearCart, total } = useCartContext();
    return { items, addToCart, removeFromCart, clearCart, total };
};