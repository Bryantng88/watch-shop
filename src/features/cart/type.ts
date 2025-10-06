
import type { Product } from "../features/catalog/product";

export interface CartItem {
    id: string | number;
    title: string;
    price: number;
    img: string;
    quantity: number;
}

export type AddToCartFromProduct = Pick<Product, "id" | "title" | "img"> & {
    price: number;     // chuyển từ Product.price nếu là string
    quantity?: number;
};

export interface CartState {
    items: CartItem[];
}

export type AddToCartInput = Omit<CartItem, "quantity"> & { quantity?: number };