// app/products/[slug]/page.tsx
import ProductMeta from "@/components/product/ProductMeta/productMeta";
import ProductGallery from "@/app/products/[slug]/ProductGallery";
import Cart from "@/app/products/[slug]/Cart";
import styles from "./detail.module.css";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard/ProductCard";
import Accordion from "@/components/product/Accordion/Accordion";

// dùng đúng đường dẫn data của bạn:
import { products } from "@/data/products";
import AddToCart from "@/app/products/[slug]/Cart";
import type { Product } from "@/types/product";

function slugify(input: string) {
    return input
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export default async function ProductDetailPage({ params, }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const item = products.find((p) => slugify(p.title) === slug) as Product | undefined;

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
                    <Accordion
                        defaultOpenId="tech"
                        items={[
                            {
                                id: "curator",
                                title: "From The Curator",
                                content: <p>Curated description goes here…</p>,
                            },
                            {
                                id: "tech",
                                title: "Technical Details",
                                content: (
                                    <ul>
                                        <li>Brand: {item.brand ?? "—"}</li>
                                        <li>Case size: {item.caseSize ?? "—"}</li>
                                        <li>Material: {item.material ?? "—"}</li>
                                        <li>Dial color: {item.dialColor ?? "—"}</li>
                                        <li>Reference: {item.ref ?? "—"}</li>
                                        <li>Year: {item.year ?? "—"}</li>
                                    </ul>
                                ),
                            },
                            {
                                id: "payments",
                                title: "Trades + Payments",
                                content: <p>Payment and trade information…</p>,
                            },
                            {
                                id: "shipping",
                                title: "Shipping",
                                content: <p>Free domestic shipping for orders over 2,000,000 VND.</p>,
                            },
                            {
                                id: "guarantee",
                                title: "T&H Guarantee",
                                content: <p>100% authentic. Each piece inspected and time-tested.</p>,
                            },
                            {
                                id: "returns",
                                title: "Returns",
                                content: <p>7-day returns on eligible items.</p>,
                            },
                            {
                                id: "reviews",
                                title: "Recent Reviews",
                                content: <p>No reviews yet.</p>,
                            },
                        ]}
                    />
                    <ProductMeta
                        categories={["ĐỒNG HỒ VINTAGE", "VINTAGE WATCHES"]}
                        tags={["omega", "vintage4life", "vintagewatch"]}
                    />
                    {/*<section className={styles.infoBlocks}>
                        <details>
                            <summary>From The Curator</summary>
                            <p>Curated description goes here...</p>
                        </details>

                        <details>
                            <summary>Technical Details</summary>
                            <ul>
                                <li>Brand: Cartier</li>
                                <li>Case size: 36</li>
                                <li>Material: 18KT WG</li>
                                <li>Dial color: Black</li>
                            </ul>
                        </details>

                        <details>
                            <summary>Trades + Payments</summary>
                            <p>Payment and trade information...</p>
                        </details>

                        <details>
                            <summary>Shipping</summary>
                            <p>Free domestic shipping for orders over 2,000,000 VND.</p>
                        </details>

                        <details>
                            <summary>T&H Guarantee</summary>
                            <p>100% authentic. Each piece inspected before listing.</p>
                        </details>

                        <details>
                            <summary>Returns</summary>
                            <p>7-day returns on eligible items.</p>
                        </details>

                        <details>
                            <summary>Recent Reviews</summary>
                            <p>No reviews yet.</p>
                        </details>
                    </section>*/}

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
