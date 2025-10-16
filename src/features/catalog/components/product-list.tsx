import ProductCard from "./product-card";
import { ProductCardData } from "../server/types";

export function ProductList({ products }: { products: ProductCardData[] }) {
    const test = products.map((i) => {
        console.log('feature/catalog/compinent/product-list : in ra: ' + i.slug)
    })
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
                <ProductCard key={p.slug ?? p.title + i} item={p} />
            ))}
        </div>


    );

}
