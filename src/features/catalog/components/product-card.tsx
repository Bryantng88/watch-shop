'use client';
import Link from 'next/link';

export type Product = {
    title: string;
    img: string;
    price: number | string;
    status?: 'sold' | 'on hold' | 'available';
    tag?: string;
};

export const slugify = (s: string) =>
    s
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

export default function ProductCard({ item }: { item: Product }) {
    return (
        <div className="card product-card h-100">
            <div
                className={`img-wrapper ${item.status === "sold" ? "is-out" : ""
                    }`}
            >
                <Link href={`/products/${slugify(item.title)}`}>
                    <img src={item.img} className="card-img-top" alt="Watch" />
                </Link>

                {item.status === "sold" && (
                    <div className="status-band is-sold">OUT OF STOCK</div>
                )}
                {item.status === "on hold" && (
                    <div className="status-band is-hold">ON HOLD</div>
                )}
            </div>

            <div className="card-body">
                <h6 className="card-title product-title">{item.title}</h6>
                <div className="product-meta">
                    {item.status === "sold" ? (
                        <p className="product-price">Contact Us</p>
                    ) : (
                        <p className="card-text product-price">
                            {Intl.NumberFormat("en-US").format(
                                Number(item.price)
                            )}{" "}
                            VND
                        </p>
                    )}
                    <span className="product-tag">
                        {item.tag}
                    </span>
                </div>
            </div>
        </div>
    );
}