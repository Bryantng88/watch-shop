"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Product Quick Publish UI (Badge + Modal)
 *
 * - <ProductStatusBadge/>: đặt vào ô Status của bảng list sản phẩm.
 *   + Nếu PUBLISHED/ARCHIVED: render badge tĩnh.
 *   + Nếu DRAFT: render nút DRAFT (đỏ), click mở <QuickPublishModal/>.
 *
 * - <QuickPublishModal/>: side modal hiển thị checklist + nút Publish.
 *   + Gọi API:
 *       GET  /api/admin/products/:id/publish-check
 *       POST /api/admin/products/:id/publish
 *   + Nếu bạn cần PATCH partial, gọi từ nơi khác (form edit) hoặc bổ sung nút vào đây.
 */

// ================== Utils ==================
async function json<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text.startsWith("<!DOCTYPE") ? `HTTP ${res.status}` : text);
    }
    return res.json();
}

function cx(...xs: (string | false | null | undefined)[]) {
    return xs.filter(Boolean).join(" ");
}

// ================== Types (khớp service) ==================

type MissingItem =
    | { key: "images"; label: string; count: number }
    | { key: "brandId"; label: string }
    | { key: "variant"; label: string }
    | { key: "watchSpec"; label: string; fields: string[] };

type VariantSnap = {
    id: string;
    price: any;
    availabilityStatus: string;
    stockQty: number | null;
};

type PublishSnapshot = {
    imageCount: number;
    brandId: string | null;
    hasSellableVariant: boolean;
    variants: VariantSnap[];
    watchSpec?: any | null;
};

type PublishCheckResponse = {
    pass: boolean;
    missing: MissingItem[];
    snapshot: PublishSnapshot;
};

// ================== Modal primitives ==================

function SideModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    return (
        <div className={cx("fixed inset-0 z-50", open ? "" : "hidden")}>
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <button onClick={onClose} className="rounded p-2 hover:bg-gray-100" aria-label="Close">✕</button>
                </div>
                <div className="h-[calc(100%-56px)] overflow-auto p-5">{children}</div>
            </div>
        </div>
    );
}

function Checklist({ pass, missing }: { pass: boolean; missing: MissingItem[] }) {
    const item = (ok: boolean, text: React.ReactNode) => (
        <li className={cx("flex items-start gap-2", ok ? "text-green-700" : "text-orange-700")}>• {text}</li>
    );
    const lack = (k: MissingItem["key"]) => !missing.find(m => m.key === k);
    const ws = missing.find(m => m.key === "watchSpec") as Extract<MissingItem, { key: "watchSpec" }> | undefined;

    return (
        <div className="rounded-md border p-4 bg-gray-50">
            <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold">Checklist xuất bản</div>
                <span className={cx("rounded-full px-2 py-0.5 text-xs font-semibold", pass ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>{pass ? "ĐÃ ĐỦ" : `Thiếu ${missing.length}`}</span>
            </div>
            <ul className="space-y-1 text-sm">
                {item(lack("images"), <>Ảnh sản phẩm ≥ 4</>)}
                {item(lack("brandId"), <>Có thương hiệu</>)}
                {item(lack("variant"), <>Ít nhất 1 biến thể có giá & ACTIVE</>)}
                {ws ? (
                    <li className="text-orange-700 text-sm">
                        • Thông số kỹ thuật thiếu: <span className="text-xs text-gray-700">{ws.fields.slice(0, 4).join(", ")}{ws.fields.length > 4 ? ` +${ws.fields.length - 4}` : ""}</span>
                    </li>
                ) : (
                    <li className="text-green-700">• Thông số kỹ thuật đầy đủ</li>
                )}
            </ul>
        </div>
    );
}

// ================== QuickPublishModal ==================

export function QuickPublishModal({ productId, onClose }: { productId: string; onClose: () => void }) {
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PublishCheckResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pass = !!data?.pass;

    async function load() {
        setChecking(true); setError(null);
        try {
            const res = await fetch(`/api/admin/products/${productId}/publish-check`);
            const r = await json<PublishCheckResponse>(res);
            setData(r);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setChecking(false);
        }
    }

    async function publish() {
        setLoading(true); setError(null);
        try {
            const res = await fetch(`/api/admin/products/${productId}/publish`, { method: "POST" });
            await json(res);
            onClose();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, [productId]);

    return (
        <SideModal open={true} onClose={onClose} title="Hoàn tất để hiển thị">
            {checking && <div className="text-sm text-gray-500">Đang kiểm tra…</div>}
            {error && <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>}
            {data && (
                <div className="space-y-4">
                    <Checklist pass={data.pass} missing={data.missing} />
                    <div className="flex justify-end gap-2 pt-3 border-t">
                        <button onClick={load} disabled={loading} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Kiểm tra lại</button>
                        <button onClick={publish} disabled={!pass || loading} className={cx("rounded-md px-3 py-2 text-sm font-semibold text-white", pass ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed")}>Publish</button>
                    </div>
                </div>
            )}
        </SideModal>
    );
}

// ================== ProductStatusBadge ==================
