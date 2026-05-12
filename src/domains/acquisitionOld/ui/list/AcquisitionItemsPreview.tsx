"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Link2, Package2 } from "lucide-react";
import type { AcquisitionListItem } from "./types";
import { fmtMoney } from "./helpers";

type Rect = { top: number; left: number; width: number };

export default function AcquisitionItemsPreview({
    row,
}: {
    row: AcquisitionListItem;
}) {
    const btnRef = React.useRef<HTMLButtonElement | null>(null);
    const [open, setOpen] = React.useState(false);
    const [rect, setRect] = React.useState<Rect | null>(null);

    const summaryText = `${row.itemCount} dòng · ${row.linkedWatchCount} đã link watch${row.remainingCount > 0 ? ` · +${row.remainingCount} dòng khác` : ""
        }`;

    const measure = React.useCallback(() => {
        const el = btnRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        const width = 460;

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
            if (
                pop &&
                (pop.contains(e.target as Node) || btnRef.current?.contains(e.target as Node))
            ) {
                return;
            }
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
            <div className="space-y-1">
                {row.previewTitles.slice(0, 2).map((title, index) => (
                    <div
                        key={`${row.id}-${index}`}
                        className={index === 0 ? "text-sm font-medium text-slate-900" : "text-xs text-slate-500"}
                    >
                        {title}
                    </div>
                ))}
            </div>

            <button
                ref={btnRef}
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="mt-2 inline-flex items-center rounded-md px-1 py-0.5 text-xs font-medium text-sky-700 transition hover:bg-sky-50 hover:text-sky-800"
            >
                {summaryText}
            </button>

            {open && rect && typeof window !== "undefined"
                ? createPortal(
                    <div
                        id={`acq-items-popover-${row.id}`}
                        style={{
                            position: "fixed",
                            top: rect.top,
                            left: rect.left,
                            width: rect.width,
                        }}
                        className="z-[1000] max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.16)]"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <div>
                                <div className="text-sm font-semibold text-slate-900">
                                    Acquisition items
                                </div>
                                <div className="mt-0.5 text-xs text-slate-500">
                                    {row.refNo} · {row.itemCount} dòng
                                </div>
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
                                <div
                                    key={item.id}
                                    className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-md bg-white px-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                            {item.index}
                                        </span>
                                        <div className="truncate text-sm font-medium text-slate-900">
                                            {item.title}
                                        </div>
                                    </div>

                                    {item.subtitle ? (
                                        <div className="mt-1 pl-7 text-xs text-slate-500">
                                            {item.subtitle}
                                        </div>
                                    ) : null}

                                    <div className="mt-2 flex flex-wrap items-center gap-2 pl-7">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200">
                                            <Package2 className="h-3 w-3" />
                                            {item.quantity != null ? `${item.quantity} món` : "Chưa rõ SL"}
                                        </span>

                                        <span className="inline-flex rounded-full bg-white px-2 py-1 text-[11px] text-slate-600 ring-1 ring-slate-200">
                                            {fmtMoney(item.cost)}
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
                            ))}
                        </div>
                    </div>,
                    document.body
                )
                : null}
        </>
    );
}