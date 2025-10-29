"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { toPublicUrl } from "@/features/ultis/helpers";

interface Product {
    id: string;
    title: string;
    brand: { name: string } | null;
    type: string;
    status: string;
    minPrice: number | null;
    image?: string | null;
    updatedAt: string;
}

export default function AdminProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const sp = useSearchParams();

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch(`/api/admin/products?${sp.toString()}`);
                const data = await res.json();
                setProducts(data.items || []);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [sp]);

    async function handleDelete(id: string) {
        if (!confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) return;
        try {
            await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            setProducts((prev) => prev.filter((x) => x.id !== id));
        } catch (err) {
            alert("Xoá thất bại!");
        }
    }

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-4 py-2 text-left">Ảnh</th>
                        <th className="px-4 py-2 text-left">Tên</th>
                        <th className="px-4 py-2 text-left">Thương hiệu</th>
                        <th className="px-4 py-2 text-left">Loại</th>

                        <th className="px-4 py-2 text-left">Giá Bán</th>
                        <th className="px-4 py-2 text-left">Trạng thái</th>
                        <th className="px-4 py-2 text-left">Cập nhật</th>

                        <th className="px-4 py-2 text-right">Hành động</th>

                    </tr>
                </thead>

                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-500">
                                Đang tải danh sách sản phẩm...
                            </td>
                        </tr>
                    ) : products.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-8 text-center text-gray-400 italic">
                                Không có sản phẩm nào
                            </td>
                        </tr>
                    ) : (
                        products.map((p) => (
                            <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-2">
                                    {p.image ? (
                                        <img
                                            src={`/api/media/sign?key=${encodeURIComponent(p.image)}`}
                                            alt={p.title}
                                            className="h-12 w-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-gray-200 rounded" />
                                    )}
                                </td>

                                <td className="px-4 py-2 font-medium">{p.title}</td>
                                <td className="px-4 py-2">{p.brand?.name || "-"}</td>
                                <td className="px-4 py-2 font-medium">{p.type}</td>
                                <td className="px-4 py-2">
                                    {p.minPrice != null
                                        ? p.minPrice.toLocaleString("vi-VN") + " ₫"
                                        : "-"}
                                </td>

                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${p.status === "ACTIVE"
                                            ? "bg-green-100 text-green-700"
                                            : p.status === "SOLD"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-4 py-2 font-medium">{new Date(p.updatedAt).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                })}</td>


                                <td className="px-4 py-2 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/products/${p.id}`} className="p-1 hover:text-blue-600">
                                            <Eye size={16} />
                                        </Link>
                                        <Link
                                            href={`/admin/products/${p.id}/edit`}
                                            className="p-1 hover:text-amber-600"
                                        >
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="p-1 hover:text-red-600"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
