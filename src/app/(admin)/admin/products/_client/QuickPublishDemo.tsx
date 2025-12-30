"use client";

import React, { useEffect, useMemo, useState } from "react";

type MissingItem =
    | { key: "images"; label: string; count: number }
    | { key: "brandId"; label: string }
    | { key: "variant"; label: string }
    | { key: "watchSpec"; label: string; fields: string[] };

type VariantSnap = { id?: string; price?: number | string; availabilityStatus?: string; stockQty?: number };
type PublishSnapshot = {
    imageCount: number;
    brandId: string | null;
    hasSellableVariant: boolean;
    variants: { id: string; price: any; availabilityStatus: string; stockQty: number | null }[];
    watchSpec?: any | null;
};
type PublishCheckResponse = { pass: boolean; missing: MissingItem[]; snapshot: PublishSnapshot };

function cx(...xs: (string | false | null | undefined)[]) { return xs.filter(Boolean).join(" "); }
async function json<T>(res: Response): Promise<T> {
    if (!res.ok) { const t = await res.text(); throw new Error(t.startsWith("<!DOCTYPE") ? `HTTP ${res.status}` : t); }
    return res.json();
}

function SideModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    return (
        <div className={cx("fixed inset-0 z-50", open ? "" : "hidden")}>
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <button onClick={onClose} className="rounded p-2 hover:bg-gray-100">✕</button>
                </div>
                <div className="h-[calc(100%-56px)] overflow-auto p-5">{children}</div>
            </div>
        </div>
    );
}

function Checklist({ pass, missing }: { pass: boolean; missing: MissingItem[] }) {
    const ok = (k: MissingItem["key"]) => !missing.find(m => m.key === k);
    const ws = missing.find(m => m.key === "watchSpec") as Extract<MissingItem, { key: "watchSpec" }> | undefined;
    return (
        <div className="rounded-md border p-4 bg-gray-50">
            <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold">Checklist xuất bản</div>
                <span className={cx("rounded-full px-2 py-0.5 text-xs font-semibold", pass ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700")}>
                    {pass ? "ĐÃ ĐỦ" : `Thiếu ${missing.length}`}
                </span>
            </div>
            <ul className="space-y-1 text-sm">
                <li className={ok("images") ? "text-green-700" : "text-orange-700"}>• Ảnh sản phẩm ≥ 4</li>
                <li className={ok("brandId") ? "text-green-700" : "text-orange-700"}>• Có thương hiệu</li>
                <li className={ok("variant") ? "text-green-700" : "text-orange-700"}>• Ít nhất 1 biến thể có giá & ACTIVE</li>
                {ws ? (
                    <li className="text-orange-700">• Thông số kỹ thuật thiếu:
                        <span className="text-xs text-gray-700"> {ws.fields.slice(0, 4).join(", ")}{ws.fields.length > 4 ? ` +${ws.fields.length - 4}` : ""}</span>
                    </li>
                ) : <li className="text-green-700">• Thông số kỹ thuật đầy đủ</li>}
            </ul>
        </div>
    );
}

/** PROPS:
 * - brandOptions: mảng brand (để chọn nhanh)
 * - ImagePicker: optional component nếu bạn có sẵn; nếu không, sẽ dùng input text fileKey.
 */
export default function QuickPublishModal({
    productId,
    onClose,
    brands = [],
    ImagePicker,
}: {
    productId: string;
    onClose: () => void;
    brands?: { id: string; name: string }[];
    ImagePicker?: React.ComponentType<{ value: { key: string; url?: string }[]; onChange: (v: { key: string; url?: string }[]) => void }>;
}) {
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PublishCheckResponse | null>(null);
    const [err, setErr] = useState<string | null>(null);

    // local form for missing fields
    const missing = useMemo(() => new Set((data?.missing ?? []).map(m => m.key)), [data]);
    const [brandId, setBrandId] = useState<string>("");
    const [images, setImages] = useState<{ key: string; url?: string }[]>([]);
    const [variant, setVariant] = useState<VariantSnap>({ availabilityStatus: "ACTIVE", stockQty: 1 });

    const pass = !!data?.pass;

    async function load() {
        setChecking(true); setErr(null);
        try {
            const res = await fetch(`/api/admin/products/${productId}/publish-check`);
            const r = await json<PublishCheckResponse>(res);
            setData(r);

            // seed form with snapshot
            setBrandId(r.snapshot.brandId ?? "");
            if (missing.has("images")) setImages([]); // user will add
            if (missing.has("variant")) setVariant({ availabilityStatus: "ACTIVE", stockQty: 1 });
        } catch (e: any) {
            setErr(e.message);
        } finally { setChecking(false); }
    }
    useEffect(() => { load(); /* eslint-disable-next-line */ }, [productId]);

    async function savePartial() {
        const dto: any = {};
        if (missing.has("brandId") && brandId) dto.product = { brandId };
        if (missing.has("images") && images.length) {
            dto.images = images.map((x, i) => ({ fileKey: x.key, alt: null, sortOrder: i }));
        }
        if (missing.has("variant") && (variant.price || variant.availabilityStatus)) {
            dto.variants = [{ ...variant }];
        }
        if (!Object.keys(dto).length) return;

        setLoading(true); setErr(null);
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto),
            });
            await json(res);
            await load(); // re-check
        } catch (e: any) { setErr(e.message); }
        finally { setLoading(false); }
    }

    async function publish() {
        setLoading(true); setErr(null);
        try {
            const res = await fetch(`/api/admin/products/${productId}/publish`, { method: "POST" });
            await json(res);
            onClose();
        } catch (e: any) { setErr(e.message); }
        finally { setLoading(false); }
    }

    return (
        <SideModal open={true} onClose={onClose} title="Hoàn tất để hiển thị">
            {checking && <div className="text-sm text-gray-500">Đang kiểm tra…</div>}
            {err && <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{err}</div>}

            {data && (
                <div className="space-y-5">
                    <Checklist pass={data.pass} missing={data.missing} />

                    {/* --- Quick form: chỉ render phần đang thiếu --- */}
                    <div className="space-y-4">
                        {missing.has("brandId") && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Thương hiệu *</label>
                                <select
                                    className="w-full rounded-md border px-3 py-2"
                                    value={brandId}
                                    onChange={(e) => setBrandId(e.target.value)}
                                >
                                    <option value="">-- Chọn thương hiệu --</option>
                                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>
                        )}

                        {missing.has("images") && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bổ sung ảnh (đủ ≥ 4)</label>
                                {ImagePicker ? (
                                    <ImagePicker value={images} onChange={setImages} />
                                ) : (
                                    <div className="space-y-2">
                                        {images.map((it, i) => (
                                            <input key={i} className="w-full rounded-md border px-3 py-2"
                                                placeholder="fileKey ảnh (S3/NAS)"
                                                value={it.key}
                                                onChange={(e) => {
                                                    const next = [...images]; next[i] = { ...it, key: e.target.value }; setImages(next);
                                                }} />
                                        ))}
                                        <button type="button" className="rounded-md border px-3 py-1 text-sm"
                                            onClick={() => setImages(prev => [...prev, { key: "" }])}>+ Thêm ảnh</button>
                                    </div>
                                )}
                            </div>
                        )}

                        {missing.has("variant") && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Biến thể bán được</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <input type="number" min={0} placeholder="Giá (VND)"
                                        className="rounded-md border px-3 py-2"
                                        value={(variant.price as any) ?? ""}
                                        onChange={(e) => setVariant(v => ({ ...(v ?? {}), price: e.target.value }))} />
                                    <select className="rounded-md border px-3 py-2"
                                        value={variant.availabilityStatus ?? "ACTIVE"}
                                        onChange={(e) => setVariant(v => ({ ...(v ?? {}), availabilityStatus: e.target.value }))}>
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                        <option value="HOLD">HOLD</option>
                                        <option value="HIDDEN">HIDDEN</option>
                                    </select>
                                    <input type="number" min={0} placeholder="Tồn kho"
                                        className="rounded-md border px-3 py-2"
                                        value={variant.stockQty ?? 1}
                                        onChange={(e) => setVariant(v => ({ ...(v ?? {}), stockQty: Number(e.target.value || 0) }))} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t">
                        <button onClick={load} disabled={loading} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Kiểm tra lại</button>
                        <button onClick={savePartial} disabled={loading} className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">Lưu các mục bổ sung</button>
                        <button onClick={publish} disabled={!pass || loading}
                            className={cx("rounded-md px-3 py-2 text-sm font-semibold text-white",
                                pass ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed")}>Publish</button>
                    </div>
                </div>
            )}
        </SideModal>
    );
}
