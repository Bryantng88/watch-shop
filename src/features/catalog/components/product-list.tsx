import ProductCard from "./product-card";

export function ProductList({ products }: { products: any[] }) {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
                <ProductCard key={p.id} item={p} />
            ))}
        </div>
    );
}
