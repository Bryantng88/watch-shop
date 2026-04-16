// features/products/_admin/AdminProductPage.tsx
import AdminProductList from "./admin-product-list";
import Breadcrumbs from "@/features/admin/layout/breadcumbs";
import AdminProductFilterBar from "@/features/admin/layout/filter-bar";
import Link from "next/link";
import NewProductButton from "./new_product_button";
import { PRODUCT_TYPES } from "@/features/meta/server/enum";
import { brands } from "@/constants/constants";
import { listBrands } from "@/features/catalog/server/brands.repo";

export default async function AdminProductPage() {
    const ProductType = Object.values(PRODUCT_TYPES).map(v => ({
        label: v,
        value: v,
    }));

    const brands = await listBrands();

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
                <NewProductButton productTypes={ProductType} />
            </div>

            {/* Bảng danh sách */}
            <div className="pt-4">
                <AdminProductList
                    brands={brands}
                />
            </div>
        </div>
    );
}
