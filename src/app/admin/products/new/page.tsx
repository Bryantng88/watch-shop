// app/admin/products/new/page.tsx
import NewProductForm2 from "@/features/products/_admin/new-product-form2";
import { listBrands } from "@/features/catalog/server/brands.repo"; // <- repo có sẵn của bạn\
import { AVAILABILITY_STATUS, PRODUCT_TYPES, CASE_TYPES, MOVEMENT_TYPES } from "@/features/meta/server/enum";
import { listVendor } from "@/features/vendors/server/vendor.repo";
import { listComplications } from "@/features/catalog/server/complications.repo";

export const metadata = { title: "New Product · Admin" };
type Option = { label: string; value: string };
const human = (s: string) => s.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());

export default async function NewProductPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    // Lấy brand options cho select
    const brands = await listBrands(); // trả về [{id,name}]
    const vendors = await listVendor()
    const complications = await listComplications()
    const sp = await searchParams;                       // ✅ phải await
    const selectedTypeRaw = sp.type;
    const selectedType =
        Array.isArray(selectedTypeRaw) ? selectedTypeRaw[0] : selectedTypeRaw || 'WATCH';
    const STATUS_OPTIONS: Option[] = (Object.values(AVAILABILITY_STATUS) as string[])
        .map(s => ({ label: human(s), value: s }));
    const MOVEMENT_OPTIONS: Option[] = (Object.values(MOVEMENT_TYPES) as string[])
        .map(s => ({ label: human(s), value: s }));

    const TYPE_OPTIONS: Option[] = (Object.values(PRODUCT_TYPES) as string[])
        .map(t => ({ label: human(t), value: t }));

    const CASE_OPTIONS: Option[] = (Object.values(CASE_TYPES) as string[])
        .map(c => ({ label: human(c), value: c }));
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between ">
                <h1 className="text-2xl font-semibold">Tạo sản phẩm mới</h1>
            </div>

            <NewProductForm2
                complicationOptions={complications}
                vendors={vendors}
                selectedType={selectedType}
                brands={brands}
                statusOptions={STATUS_OPTIONS}
                typeOptions={TYPE_OPTIONS}
                caseOptions={CASE_OPTIONS}
                movementOptions={MOVEMENT_OPTIONS}
            />
        </div>
    );
}
