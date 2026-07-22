"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { ImageIcon, Link2, Package2 } from "lucide-react";

import type { AcquisitionListItem } from "./types";
import { fmtMoney } from "./helpers";

type Rect = { top: number; left: number; width: number };

function ItemThumb({ src, title }: { src?: string | null; title: string }) {
    if (!src) {
        return (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-300">
                <ImageIcon className="h-4 w-4" />
            </div>
        );
    }

    return (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img src={src} alt={title} className="h-full w-full object-cover" loading="lazy" />
        </div>
    );
}

function ItemThumbStack({ row }: { row: AcquisitionListItem }) {
    const items = row.detailItems.slice(0, 3);

    if (items.length <= 1) {
        return <ItemThumb src={items[0]?.imageUrl} title={items[0]?.title || row.refNo} />;
    }

    return (
        <span className="relative h-12 w-[60px] shrink-0">
            {items.map((item, index) => (
                <span
                    key={item.id}
                    className="absolute top-0 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-slate-100 text-xs font-semibold text-slate-400 ring-1 ring-slate-200"
                    style={{ left: index * 6, zIndex: items.length - index }}
                >
                    {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <ImageIcon className="h-4 w-4" />
                    )}
                </span>
            ))}
            {row.itemCount > 1 ? (
                <span className="absolute -bottom-1 -right-1 z-10 rounded-full bg-slate-950 px-1.5 py-0.5 text-[9px] font-bold text-white ring-2 ring-white">
                    +{row.itemCount - 1}
                </span>
            ) : null}
        </span>
    );
}

export default function AcquisitionItemsPreview({ row }: { row: AcquisitionListItem }) {
    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [rect, setRect] = React.useState<Rect | null>(null);

    const measure = React.useCallback(() => {
        const el = btnRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const width = Math.min(520, window.innerWidth - 24);

        setRect({
            top: r.bottom + 8,
            left: Math.max(12, Math.min(r.left, window.innerWidth - width - 12)),
            width,
        });
    }, []);

    React.useLayoutEffect(() => {
        if (open) measure();
    }, [open, measure]);

    React.useEffect(() => {
        if (!open) return;

        function onResize() {
            measure();
        }

        function onScroll() {
            measure();
        }

        function onMouseDown(e: MouseEvent) {
            const pop = document.getElementById(`acq-items-popover-${row.id}`);
            if (pop && (pop.contains(e.target as Node) || btnRef.current?.contains(e.target as Node))) return;
            setOpen(false);
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }

        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, true);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("keydown", onKeyDown);

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll, true);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [open, measure, row.id]);

    return (
        <>
            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full min-w-0 items-center gap-3 rounded-xl p-1.5 text-left transition hover:bg-sky-50"
            >
                <ItemThumbStack row={row} />
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                        {row.detailItems[0]?.title || "Chưa có thông tin sản phẩm"}
                    </span>
                    <span className="mt-1 block text-xs text-sky-700">
                        {row.itemCount} dòng · {row.linkedWatchCount} đã liên kết
                    </span>
                </span>
            </button>

            {open && rect && typeof window !== "undefined"
                ? createPortal(
                    <div
                        id={`acq-items-popover-${row.id}`}
                        style={{ position: "fixed", top: rect.top, left: rect.left, width: rect.width }}
                        className="z-[1000] max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
                    >
                        <div className="mb-3 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-slate-900">Acquisition items</div>
                                <div className="mt-0.5 text-xs text-slate-500">{row.refNo} · {row.itemCount} dòng</div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                            >
                                Đóng
                            </button>
                        </div>

                        <div className="space-y-2">
                            {row.detailItems.map((item) => (
                                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5">
                                    <div className="flex gap-3">
                                        <ItemThumb src={item.imageUrl} title={item.title} />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <span className="inline-flex h-5 min-w-[20px] shrink-0 items-center justify-center rounded-md bg-white px-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                                    {item.index}
                                                </span>
                                                <div className="truncate text-sm font-semibold text-slate-900">{item.title}</div>
                                            </div>

                                            {item.subtitle ? <div className="mt-1 truncate text-xs text-slate-500">{item.subtitle}</div> : null}

                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200">
                                                    <Package2 className="h-3 w-3" />
                                                    {item.quantity != null ? `${item.quantity} món` : "Chưa rõ SL"}
                                                </span>

                                                <span className="inline-flex rounded-full bg-white px-2 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200">
                                                    {fmtMoney(item.totalAmount)}
                                                </span>

                                                {item.linkedWatchProductId ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700 ring-1 ring-emerald-200">
                                                        <Link2 className="h-3 w-3" />
                                                        Đã link watch
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex rounded-full bg-amber-50 px-2 py-1 text-[11px] text-amber-700 ring-1 ring-amber-200">
                                                        Chưa link watch
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>,
                    document.body,
                )
                : null}
        </>
    );
}
