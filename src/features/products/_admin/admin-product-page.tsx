// features/products/_admin/AdminProductPage.tsx
import AdminProductList from "./admin-product-list";
import Breadcrumbs from "@/features/admin/layout/breadcumbs";
import AdminProductFilterBar from "@/features/admin/layout/filter-bar";
import Link from "next/link";
export default function AdminProductPage() {
    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumbs
                items={[
                    { label: "Admin", href: "/admin" },
                    { label: "Products" },
                ]}
            />

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Sản phẩm</h1>

            </div>

            {/* Filter bar */}
            <div className="flex items-end justify-between">
                <div className="flex-1">
                    <AdminProductFilterBar />
                </div>
                <Link
                    href="/admin/products/new"
                    className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                    + Thêm sản phẩm
                </Link>
            </div>

            {/* Bảng danh sách */}
            <div className="pt-4">
                <AdminProductList />
            </div>
        </div>
    );
}
