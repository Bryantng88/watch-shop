
"use client"
import { useCartContext } from "@/features/cart/context/CartDataContext";



export default function AddToCart({ product }: { product: any }) {
    const { addToCart } = useCartContext();

    return (
        <button
            className="btn btn-dark"
            onClick={() =>
                addToCart({
                    id: product.id,
                    title: product.title,
                    price: Number(product.price),
                    img: product.img,
                    quantity: 1,
                })
            }
        >
            Add to cart
        </button>
    );
}



