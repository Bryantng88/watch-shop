// app/admin/products/new/page.tsx
import NewProductForm2 from "@/features/products/_admin/new-product-form2";
import { listBrands } from "@/features/catalog/server/brands.repo"; // <- repo có sẵn của bạn\
import { PRODUCT_STATUSES, PRODUCT_TYPES, CASE_TYPES } from "@/features/meta/server/enum";

export const metadata = { title: "New Product · Admin" };

export default async function NewProductPage({ searchParams }: { searchParams: { type?: string } }) {
    // Lấy brand options cho select
    const brands = await listBrands(); // trả về [{id,name}]
    const selectedType = searchParams.type ?? 'WATCH';
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Tạo sản phẩm mới</h1>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <NewProductForm2
                    selectedType={selectedType}
                    brands={brands}
                    statusOptions={PRODUCT_STATUSES}
                    typeOptions={PRODUCT_TYPES}
                    caseOPtions={CASE_TYPES}
                />
            </div>
        </div>
    );
}
