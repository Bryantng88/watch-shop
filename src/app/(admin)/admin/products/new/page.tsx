import NewProductForm2 from "../_client/NewProductForm";
import NewStrapBatchForm from "../_client/NewStrapBatchForm";
import { listBrands } from "@/features/catalog/server/brands.repo";
import { listVendor } from "@/features/vendors/server/vendor.repo";
import { getOptions } from "@/features/products/components/options";

export const metadata = { title: "New Product · Admin" };

export default async function NewProductPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const sp = await searchParams;
    const selectedTypeRaw = sp.type;
    const selectedType =
        (Array.isArray(selectedTypeRaw) ? selectedTypeRaw[0] : selectedTypeRaw) || "WATCH";

    const vendors = await listVendor();

    if (selectedType === "WATCH_STRAP") {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Tạo dây mới</h1>
                </div>

                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <NewStrapBatchForm vendors={vendors} />
                </div>
            </div>
        );
    }

    const [brands, opts] = await Promise.all([listBrands(), getOptions()]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Tạo sản phẩm mới</h1>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <NewProductForm2
                    vendors={vendors}
                    brands={brands}
                    selectedType={selectedType}
                    statusOptions={opts.status}
                    typeOptions={opts.type}
                    caseOptions={opts.case}
                    movementOptions={opts.movement}
                    complicationOptions={opts.complication}
                    lastUpdated={new Date().toISOString()}
                />
            </div>
        </div>
    );
}