'use client';
import Link from 'next/link';
import { ProductCardData } from '../server/types';

const toSlug = (s: string) =>
    s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

const fmtVND = (v?: number | null) =>
    typeof v === 'number' && !Number.isNaN(v)
        ? new Intl.NumberFormat('vi-VN').format(v) + ' VND'
        : 'Contact Us';

export default function ProductCard({ item }: { item: ProductCardData }) {
    const priceNum =
        typeof item.price === 'string' ? Number(item.price) : item.price;

    const isSold = item.status === 'sold';
    const isHold = item.status === 'on hold';
    const img = item.primaryImageUrl ?? undefined;
    console.log('test nhanh hinh anh ' + img)

    return (
        <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            {/* image */}
            <Link href={`/products/${item.slug ?? toSlug(item.title)}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={item.primaryImageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {isSold && (
                        <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white">
                            OUT OF STOCK
                        </span>
                    )}
                    {isHold && !isSold && (
                        <span className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-1 text-xs font-medium text-white">
                            ON HOLD
                        </span>
                    )}
                </div>
            </Link>

            {/* body */}
            <div className="p-4">
                <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-gray-900">
                    {item.title}
                </h3>
                {item.tag && (
                    <p className="mt-1 text-xs text-gray-500">{item.tag}</p>
                )}
                <div className="mt-3 text-base font-semibold text-gray-900">
                    {isSold ? 'Contact Us' : fmtVND(priceNum)}
                </div>
            </div>
        </div>
    );
}
