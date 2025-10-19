// app/admin/products/new/page.tsx
import NewProductForm from "@/features/products/_admin/new-product-form";
import { listBrands } from "@/features/catalog/server/brands.repo"; // <- repo có sẵn của bạn

export const metadata = { title: "New Product · Admin" };

export default async function NewProductPage() {
    // Lấy brand options cho select
    const brands = await listBrands(); // trả về [{id,name}]
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Tạo sản phẩm mới</h1>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <NewProductForm brands={brands} />
            </div>
        </div>
    );
}
