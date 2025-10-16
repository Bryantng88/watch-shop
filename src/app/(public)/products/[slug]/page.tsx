import ProductGallery from '@/features/catalog/components/product-gallery';
import ProductCard from '@/features/catalog/components/product-card';
import { getProductBySlug } from '@/features/product-detail/server/queries/get-product-by-slug';
export const revalidate = 60; // ISR tùy chọn
import { notFound } from 'next/navigation';
import { getRelatedProducts } from '@/features/product-detail/server/queries/get-product-by-slug';

export default async function ProductDetailPage({
    params,
}: { params: { slug: string } }) {            // <-- không phải Promise
    const { slug } = params;

    const item = await getProductBySlug(slug);
    if (!item) return notFound();

    const related = await getRelatedProducts(item.id, item.brand?.id);

    const price = item.variants[0]?.price
        ? Intl.NumberFormat('vi-VN').format(Number(item.variants[0].price)) + ' VND'
        : 'Contact Us';

    const gallery = [item.primaryImageUrl].filter(Boolean) as string[];

    return (
        <main className="container py-6">
            {/* Gallery */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ProductGallery
                    images={gallery}
                    title={item.title}
                    status={item.status}
                    classes={{}}
                />

                {/* Summary */}
                <div>
                    <h1 className="text-2xl font-semibold">{item.title}</h1>
                    <div className="mt-2 text-sm text-gray-600">{item.brand?.name ?? '—'}</div>
                    <div className="mt-3 text-xl font-bold">{price}</div>

                    <details className="mt-6">
                        <summary className="font-medium">Specifications</summary>
                        <ul className="mt-2 text-sm grid grid-cols-1 gap-1">
                            <li>Size: {item.watchSpec?.sizeCategory ?? '—'}</li>
                            <li>Material: {item.watchSpec?.caseMaterial ?? '—'}</li>
                            <li>Dial: {item.watchSpec?.dialColor ?? '—'}</li>
                            <li>Strap: {item.watchSpec?.strap ?? '—'}</li>
                            <li>Year: {item.watchSpec?.year ?? '—'}</li>
                            <li>
                                Complications: {item.watchSpec?.complication?.map(c => c.name).join(', ') || '—'}
                            </li>
                        </ul>
                    </details>
                </div>
            </section>

            {/* Related */}
            {related.length > 0 && (
                <section className="mt-10">
                    <h2 className="text-lg font-semibold mb-4">Related products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {related.map(p => (
                            <ProductCard key={p.id} item={p} />
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}