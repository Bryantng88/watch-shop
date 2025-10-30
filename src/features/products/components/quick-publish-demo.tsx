"use client";

import React, { useEffect, useMemo, useState } from "react";

// ========== types ==========
type MissingItem = { key: string; label: string; count?: number };
type PublishSnapshot = {
    imageCount: number;
    brandId: string | null;
    hasSellableVariant: boolean;
    variants: Array<{
        id: string;
        price: string | number | null;
        availabilityStatus: string;
        stockQty?: number | null;
    }>;
};
type PublishCheckResponse = {
    pass: boolean;
    missing: MissingItem[];
    snapshot: PublishSnapshot;
};

// ========== utils ==========
async function json<T>(res: Response): Promise<T> {
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
function cx(...xs: (string | false | null | undefined)[]) {
    return xs.filter(Boolean).join(" ");
}

// ========== UI Sub-components ==========

function Checklist({ pass, missing }: { pass: boolean; missing: MissingItem[] }) {
    return (
        <div className="rounded-md border p-4 bg-gray-50">
            <div className="mb-2 flex items-center justify-between">
                <div className="font-semibold text-sm">Checklist xuất bản</div>
                <span
                    className={cx(
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        pass ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    )}
                >
                    {pass ? "ĐÃ ĐỦ" : `Thiếu ${missing.length}`}
                </span>
            </div>
            <ul className="space-y-1 text-sm">
                <li
                    className={
                        missing.find((m) => m.key === "images")
                            ? "text-orange-700"
                            : "text-green-700"
                    }
                >
                    • Ảnh sản phẩm ≥ 4
                </li>
                <li
                    className={
                        missing.find((m) => m.key === "brandId")
                            ? "text-orange-700"
                            : "text-green-700"
                    }
                >
                    • Có thương hiệu
                </li>
                <li
                    className={
                        missing.find((m) => m.key === "variant")
                            ? "text-orange-700"
                            : "text-green-700"
                    }
                >
                    • 1 biến thể có giá & ACTIVE
                </li>
            </ul>
        </div>
    );
}

function SideModal({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className={cx("fixed inset-0 z-50", open ? "" : "hidden")}>
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <h3 className="font-semibold text-base">Hoàn tất để hiển thị</h3>
                    <button
                        onClick={onClose}
                        className="rounded p-2 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>
                <div className="h-[calc(100%-56px)] overflow-auto p-5">{children}</div>
            </div>
        </div>
    );
}

// ========== Main component ==========
export default function QuickPublishDemo({
    productId,
    onClose,
}: {
    productId: string;
    onClose: () => void;
}) {
    const [checking, setChecking] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PublishCheckResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const missingMap = useMemo(
        () => new Set((data?.missing ?? []).map((m) => m.key)),
        [data]
    );

    async function load() {
        setChecking(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/publish-check`);
            const jsonRes = await json<PublishCheckResponse>(res);
            setData(jsonRes);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setChecking(false);
        }
    }

    useEffect(() => {
        if (productId) load();
    }, [productId]);

    async function publish() {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/products/${productId}/publish`, {
                method: "POST",
            });
            await json(res);
            onClose();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SideModal open={true} onClose={onClose}>
            {checking && <div className="text-sm text-gray-500">Đang kiểm tra…</div>}
            {error && (
                <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">
                    {error}
                </div>
            )}
            {data && (
                <div className="space-y-4">
                    <Checklist pass={data.pass} missing={data.missing} />
                    <div className="flex justify-end gap-2 pt-3 border-t">
                        <button
                            disabled={loading || !data.pass}
                            onClick={publish}
                            className={cx(
                                "rounded-md px-3 py-2 text-sm font-semibold text-white",
                                data.pass
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "bg-gray-400 cursor-not-allowed"
                            )}
                        >
                            Publish
                        </button>
                        <button
                            onClick={load}
                            disabled={loading}
                            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            Kiểm tra lại
                        </button>
                    </div>
                </div>
            )}
        </SideModal>
    );
}
