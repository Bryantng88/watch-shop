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
    console.log("aaaaaaaaaaaaaa" + item.sizeCategory)
    const isSold = item.status === 'SOLD';
    const isHold = item.status === 'HOLD';
    const inactive = isSold || isHold
    const img = item.primaryImageUrl ?? undefined;
    return (
        <div className={`group relative overflow-hidden rounded-xl border-none transition hover:shadow-md
       '}
        `}>
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
            <div className="mt-3 py-3">
                <h3 className="text-[13px] text-gray-400 font-medium leading-snug line-clamp-2">
                    {item.title}
                </h3>
                <div className="mt-0.5 text-[13px] font-semibold text-gray-900 tracking-tight">
                    {isSold ? (
                        <span className="italic text-gray-900">Contact Us</span>
                    ) : (
                        <span>{fmtVND(priceNum)}</span>
                    )}
                </div>
            </div>
        </div>
    );
}
