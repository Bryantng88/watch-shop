"use client";

import Link from "next/link";
import { Camera, Loader2, ReceiptText, Save, ShoppingBag, Wrench } from "lucide-react";
import { operationButtonClass } from "@/domains/watch/ui/operations/shared/OperationShell";
import { cx } from "./workbench-utils";
import type { WatchWorkbenchSection } from "./types";

const NAV_ITEMS: Array<{ id: WatchWorkbenchSection; label: string }> = [
    { id: "pricing", label: "Giá & lợi nhuận" },
    { id: "spec", label: "Thông số" },
    { id: "content", label: "Nội dung" },
    { id: "images", label: "Hình ảnh" },
    { id: "trade", label: "Lịch sử" },
];

export default function WatchWorkbenchNav({
    activeSection,
    saving,
    dirty,
    onSave,
    onOpenMediaWorkspace,
    openingMediaWorkspace,
    watchSku,
}: {
    activeSection: WatchWorkbenchSection;
    saving?: boolean;
    dirty?: boolean;
    onSave: () => void;
    onOpenMediaWorkspace: () => void;
    openingMediaWorkspace?: boolean;
    watchSku?: string | null;
}) {
    return (
        <nav className="sticky top-0 z-30 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/95 p-1.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 gap-1 overflow-x-auto">
                {NAV_ITEMS.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={cx(
                            "inline-flex h-9 shrink-0 items-center rounded-lg border px-3 text-xs font-bold transition",
                            activeSection === item.id
                                ? "border-violet-200 bg-violet-50 text-violet-700"
                                : "border-transparent text-slate-500 hover:bg-violet-50 hover:text-violet-700",
                        )}
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={onOpenMediaWorkspace} disabled={openingMediaWorkspace} className={operationButtonClass({ variant: "primary", size: "sm", className: "text-xs disabled:opacity-60" })}>
                    {openingMediaWorkspace ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    Xử lý Media
                </button>
                <a href="#service" className={operationButtonClass({ variant: "softBlue", size: "sm", className: "text-xs" })}><Wrench className="h-4 w-4" /> Service</a>
                <Link href={`/admin/orders?q=${encodeURIComponent(watchSku ?? "")}`} className={operationButtonClass({ variant: "softEmerald", size: "sm", className: "text-xs" })}><ShoppingBag className="h-4 w-4" /> Order</Link>
                <Link href={`/admin/acquisitions?q=${encodeURIComponent(watchSku ?? "")}`} className={operationButtonClass({ variant: "secondary", size: "sm", className: "text-xs" })}><ReceiptText className="h-4 w-4" /> Phiếu nhập</Link>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={!dirty || saving}
                    className={operationButtonClass({ variant: "secondary", size: "sm", className: "text-xs disabled:opacity-50" })}
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {saving ? "Đang lưu" : "Lưu thay đổi"}
                </button>
            </div>
        </nav>
    );
}
