import { notFound } from "next/navigation";

import EditProductForm from "../../_client/EditProductForm";
import { detail } from "../../_server/product.service";
import * as prodRepo from "../../_server/product.repo";
import { getOptions } from "../../_components/options";

import { prisma } from "@/server/db/client";
import { listBrands } from "@/features/catalog/server/brands.repo";
import { listVendor } from "@/features/vendors/server/vendor.repo";

export const metadata = { title: "Sửa sản phẩm · Admin" };

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === "object" && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await detail(id);
    if (!product) notFound();

    const [brands, vendors, opts, categoryOptions, strapInventoryOptions] = await Promise.all([
        listBrands(),
        listVendor(),
        getOptions(),
        prodRepo.listActiveProductCategories(prisma),
        prodRepo.listAvailableStrapInventory(prisma),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Chỉnh sửa sản phẩm</h1>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
                <EditProductForm
                    initial={serialize(product)}
                    brands={serialize(brands)}
                    vendors={serialize(vendors)}
                    productStatusOptions={serialize(opts.productStatus)}
                    availabilityStatusOptions={serialize(opts.availabilityStatus)}
                    typeOptions={serialize(opts.type)}
                    caseOptions={serialize(opts.case)}
                    movementOptions={serialize(opts.movement)}
                    caseMaterialOptions={serialize(opts.caseMaterial)}
                    genderOptions={serialize(opts.gender)}
                    strapOptions={serialize(opts.strap)}
                    glassOptions={serialize(opts.glass)}
                    goldColorOptions={serialize(opts.goldColor)}
                    complicationOptions={serialize(opts.complication)}
                    categoryOptions={serialize(categoryOptions)}
                    strapInventoryOptions={serialize(strapInventoryOptions)}
                />
            </div>
        </div>
    );
}
