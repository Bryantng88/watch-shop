// app/products/[slug]/page.tsx

import ProductGallery from "../../../../features/catalog/components/gallery/product-gallery";
import styles from "./detail.module.css";
import Link from "next/link";
import ProductCard from "@/features/catalog/components/gallery/product-card";
// dùng đúng đường dẫn data của bạn:

import { Product } from "@/features/catalog/types";

import AddToCart from "../../../../features/cart/component/add-to-cart-button";
import { listProducts } from "@/features/catalog/server/product.repo";

function slugify(input: string) {
    return input
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

const products = await listProducts;

export default async function ProductDetailPage({ params, }: { params: Promise<{ slug: string }> }) {
    {/*gọi 1 hàm trả về promise */ }
    const { slug } = await params;

    const item = products.find((p) => slugify(p.title) === slug) as Product | undefined;

    const cart = []

    if (!item) {
        return (
            <main className="container py-5">
                <p>Không tìm thấy sản phẩm.</p>
                <Link href="/products" className="btn btn-dark mt-2">
                    Quay về danh sách
                </Link>
            </main>
        );
    }
    const gallery = [
        item.img,
        "http://longnd.myqnapcloud.com:8253/share.cgi/0016-3934373111160883639%2016.png?ssid=058cde3a6b5b4c318f17d74c58ff51d0&openfolder=normal&ep=&_dc=1758353027270&fid=058cde3a6b5b4c318f17d74c58ff51d0&filename=0016-3934373111160883639%2016.png",
    ]

    const isSold = item?.status === "sold";
    const isHold = item?.status === "on hold";


    const priceText =
        isSold ? "Contact Us"
            : Intl.NumberFormat("en-US").format(Number(item?.price ?? 0)) + " VND";

    // Related (lấy đại 3 món khác brand/tựa)
    const related = products
        .filter((p) => p.title !== item.title)
        .slice(0, 3);

    return (
        <main className={`${styles.wrap} container`}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link href="/">HOME</Link>
                <span>/</span>
                <Link href="/products">VINTAGE WATCHES</Link>
                <span>/</span>
                <span className={styles.current}>{item.title}</span>
            </nav>

            <section className={styles.top}>
                {/* Gallery */}
                <ProductGallery
                    images={gallery}
                    title={item.title}
                    status={item.status}
                    classes={{
                        gallery: styles.gallery,
                        media: styles.media,
                        heroImg: styles.heroImg,
                        thumbs: styles.thumbs,
                        thumbBtn: styles.thumbBtn,
                        active: styles.active,
                        banner: styles.banner,
                        sold: styles.sold,
                        hold: styles.hold,
                    }}
                />

                {/* Summary */}
                <div className={styles.summary}>
                    <h1 className={styles.title}>{item.title}</h1>

                    <div className={styles.metaRow}>
                        <span className={styles.brand}>{item.brand ?? "—"}</span>
                        {isHold && <span className={`${styles.tag} ${styles.tagHold}`}>On hold</span>}
                        {isSold && <span className={`${styles.tag} ${styles.tagSold}`}>Sold</span>}
                        {!isHold && !isSold && <span className={`${styles.tag}`}>Pre-owned</span>}
                    </div>

                    <div className={styles.price}>{priceText}</div>

                    <div className={styles.actions}>
                        {isSold ? (
                            <a href="#contact" className={styles.btnOutline}>Contact us</a>
                        ) : (
                            <>
                                <AddToCart product={item} />
                                <a href="#contact" className={styles.btnOutline}>Contact us</a>
                            </>
                        )}
                    </div>

                    <p className={styles.lead}>
                        Carefully curated vintage timepiece. Fully inspected and ready to wear.
                    </p>

                    {/* Specs */}
                    <details className={styles.block} open>
                        <summary className={styles.blockTitle}>Specifications</summary>
                        <ul className={styles.specList}>
                            <li><span>Brand</span><b>{item.brand ?? "—"}</b></li>
                            <li><span>Case size</span><b>{item.caseSize ?? "—"}</b></li>
                            <li><span>Material</span><b>{item.material ?? "—"}</b></li>
                            <li><span>Dial color</span><b>{item.dialColor ?? "—"}</b></li>
                            <li><span>Strap</span><b>{item.strap ?? "—"}</b></li>
                            <li><span>Reference</span><b>{item.ref ?? "—"}</b></li>
                            <li><span>Year</span><b>{item.year ?? "—"}</b></li>
                        </ul>
                    </details>

                    <details className={styles.block}>
                        <summary className={styles.blockTitle}>Shipping & Returns</summary>
                        <div className={styles.blockBody}>
                            Free domestic shipping for orders over 2,000,000 VND. 7-day returns on eligible items.
                        </div>
                    </details>

                    <details className={styles.block}>
                        <summary className={styles.blockTitle}>Condition & Guarantee</summary>
                        <div className={styles.blockBody}>
                            100% authentic. Each piece is inspected and time-tested prior to listing.
                        </div>
                    </details>
                </div>
            </section>

            {/* Related */}
            <section className={styles.related}>
                <h2>Related products</h2>
                <div className={styles.grid}>
                    {related.map((p) => (
                        <ProductCard key={p.id} item={p} />
                    ))}
                </div>
            </section>
        </main>
    );
}
