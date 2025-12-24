"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ProductStatusBadge from "../components/draft-badge";
import ImagePicker from "@/app/(admin)/admin/products/_components/ImagePicker";
import RowActionsMenu from "@/app/(admin)/admin/components/RowActionMenu";
import InlineImagePicker from "@/app/(admin)/admin/products/_components/InlineImagePicker";

import type {
    BrandLite,
    ProductListItem,
    ApiList,
} from "@/features/products/types";

type Props = {
    brands: BrandLite[];
};
function imageToPicked(image?: string | null) {
    if (!image) return [];
    return [
        {
            key: image,
            url: `/api/media/sign?key=${encodeURIComponent(image)}`,
        },
    ];
}

export default function AdminProductList({ brands }: Props) {
    const [products, setProducts] = useState<ProductListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const sp = useSearchParams();

    // ==========================
    // FETCH PRODUCTS
    // ==========================
    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/products?${sp.toString()}`);
                const data: ApiList<ProductListItem> = await res.json();
                setProducts(data.items || []);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [sp]);

    // ==========================
    // DELETE
    // ==========================
    async function handleDelete(id: string) {
        if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;
        try {
            await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            setProducts((prev) => prev.filter((x) => x.id !== id));
        } catch {
            alert("Xoá thất bại!");
        }
    }

    // ==========================
    // UPDATE FIELD (IMAGE / PRICE)
    // ==========================
    async function updateProduct(
        id: string,
        payload: Partial<ProductListItem>
    ) {
        await fetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...payload } : p))
        );
    }
    async function updateProductImage(productId: string, key: string) {
        const res = await fetch(`/api/admin/products/${productId}/images`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                files: [{ key }],
            }),
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        const data = await res.json();

        // update state local cho mượt UI
        setProducts((prev) =>
            prev.map((p) =>
                p.id === productId
                    ? { ...p, primaryImageUrl: data.primaryImageUrl }
                    : p
            )
        );
    }
    // ==========================
    // UI
    // ==========================
    return (
        <div className="overflow-x-auto border rounded-lg bg-white">
            <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-2 text-left">Ảnh</th>
                        <th className="px-4 py-2 text-left">Tên</th>
                        <th className="px-4 py-2 text-right">Giá bán</th>
                        <th className="px-4 py-2 text-left">Tình trạng duyệt</th>
                        <th className="px-4 py-2 text-left">Hiển thị giá</th>
                        <th className="px-4 py-2 text-left">Khả dụng</th>
                        <th className="px-4 py-2 text-left">Cập nhật</th>
                        <th className="px-4 py-2 text-left">Tạo lúc</th>
                        <th className="px-4 py-2 text-right">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={9} className="py-10 text-center text-gray-500">
                                Đang tải danh sách sản phẩm...
                            </td>
                        </tr>
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan={9} className="py-10 text-center text-gray-400 italic">
                                Không có sản phẩm nào
                            </td>
                        </tr>
                    ) : (
                        products.map((p) => (
                            <tr
                                key={p.id}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                {/* IMAGE */}
                                <td className="px-4 py-2 align-middle">
                                    <InlineImagePicker
                                        imageUrl={p.primaryImageUrl}
                                        onPick={(fileKey) => {
                                            updateProductImage(p.id, fileKey);
                                        }}
                                    />
                                </td>


                                {/* TITLE */}
                                <td className="px-4 py-2 font-medium">{p.title}</td>

                                {/* PRICE – INLINE EDIT */}
                                <td className="px-4 py-2 text-right">
                                    <input
                                        type="number"
                                        defaultValue={p.minPrice ?? ""}
                                        className="w-28 rounded border px-2 py-1 text-right"
                                        onBlur={(e) => {
                                            const value = Number(e.target.value);
                                            if (value !== p.minPrice) {
                                                updateProduct(p.id, { minPrice: value });
                                            }
                                        }}
                                    />
                                </td>

                                {/* STATUS */}
                                <td className="px-4 py-2">
                                    <ProductStatusBadge
                                        product={{ id: p.id, contentStatus: p.contentStatus }}
                                        brands={brands}
                                    />
                                </td>

                                {/* PRICE VISIBILITY */}
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${p.priceVisibility === "SHOW"
                                            ? "bg-green-100 text-green-700"
                                            : p.priceVisibility === "HIDE"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {p.priceVisibility}
                                    </span>
                                </td>

                                {/* AVAILABILITY */}
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${p.availabilityStatus === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : p.availabilityStatus === "HIDDEN"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {p.availabilityStatus}
                                    </span>
                                </td>

                                {/* UPDATED */}
                                <td className="px-4 py-2">
                                    {new Date(p.updatedAt).toLocaleString("vi-VN")}
                                </td>

                                {/* CREATED */}
                                <td className="px-4 py-2">
                                    {new Date(p.createdAt).toLocaleString("vi-VN")}
                                </td>

                                {/* ACTIONS */}
                                <td className="px-4 py-2 text-right">
                                    <RowActionsMenu
                                        onView={() => (window.location.href = `/admin/products/${p.id}`)}
                                        onEdit={() =>
                                            (window.location.href = `/admin/products/${p.id}/edit`)
                                        }
                                        onDelete={() => handleDelete(p.id)}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
