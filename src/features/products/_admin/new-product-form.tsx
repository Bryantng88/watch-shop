// features/products/_admin/NewProductForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
type BrandOption = { id: string; name: string };
type ProductStatus = string;
type ProductType = string;


export default function NewProductForm({
    brands,
    statusOptions,
    typeOptions,
}: {
    brands: BrandOption[];
    statusOptions: readonly ProductStatus[];
    typeOptions: readonly ProductType[];
}) {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [type, setType] = useState<ProductType>("WATCH");
    const [brandId, setBrandId] = useState<string>("");
    const [status, setStatus] = useState<ProductStatus>("ACTIVE");
    const [price, setPrice] = useState<string>(""); // nhập số, gửi lên server chuyển Number
    const [primaryImageUrl, setPrimaryImageUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);

        if (!title.trim()) {
            setErr("Vui lòng nhập tên sản phẩm");
            return;
        }
        if (!price || Number.isNaN(Number(price))) {
            setErr("Vui lòng nhập giá hợp lệ");
            return;
        }

        try {
            setSubmitting(true);

            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: title.trim(),
                    brandId: brandId || null,
                    status,
                    type,
                    primaryImageUrl: primaryImageUrl || null,
                    price: Number(price), // sẽ tạo 1 variant mặc định
                }),
            });

            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.message || "Tạo sản phẩm thất bại");
            }

            const data = (await res.json()) as { id: string; slug?: string };
            // Điều hướng sang trang edit chi tiết
            router.replace(`/admin/products/${data.id}/edit`);
        } catch (e: any) {
            setErr(e.message || "Tạo sản phẩm thất bại");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {err && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {err}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Tên sản phẩm</label>
                    <input
                        className="h-10 w-full rounded border px-3 text-sm outline-none focus:ring-1 focus:ring-gray-300"
                        placeholder="Ví dụ: Omega Speedmaster…"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600">Thương hiệu</label>
                    <select
                        className="h-10 w-full rounded border px-2 text-sm"
                        value={brandId}
                        onChange={(e) => setBrandId(e.target.value)}
                    >
                        <option value="">— Chọn brand —</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm text-gray-600">Trạng thái</label>
                    <select
                        className="h-10 w-full rounded border px-2 text-sm"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    >
                        {statusOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Type</label>
                    <select
                        className="h-10 w-full rounded border px-2 text-sm"
                        value={type}
                        onChange={(e) => setType(e.target.value as ProductType)}
                    >
                        {typeOptions.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Giá (đ)</label>
                    <input
                        type="number"
                        inputMode="numeric"
                        className="h-10 w-full rounded border px-3 text-sm outline-none focus:ring-1 focus:ring-gray-300"
                        placeholder="Ví dụ: 25000000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        min={0}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm text-gray-600">Ảnh chính (URL)</label>
                    <input
                        className="h-10 w-full rounded border px-3 text-sm outline-none focus:ring-1 focus:ring-gray-300"
                        placeholder="https://…"
                        value={primaryImageUrl}
                        onChange={(e) => setPrimaryImageUrl(e.target.value)}
                    />
                    {!!primaryImageUrl && (
                        <div className="mt-2">
                            <img
                                src={primaryImageUrl}
                                alt="preview"
                                className="h-24 rounded border object-cover"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={() => history.back()}
                    className="h-10 rounded border px-4 text-sm text-gray-700 hover:bg-gray-50"
                    disabled={submitting}
                >
                    Huỷ
                </button>
                <button
                    type="submit"
                    className="h-10 rounded bg-black px-5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
                    disabled={submitting}
                >
                    {submitting ? "Đang lưu…" : "Lưu & tiếp tục"}
                </button>
            </div>
        </form>
    );
}
