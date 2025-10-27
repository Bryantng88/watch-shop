// app/admin/products/[id]/edit/page.tsx
import EditProductForm from "@/features/products/_admin/product-edit-form";
import { getOptions } from "@/features/products/components/options";

import { listBrands } from "@/features/catalog/server/brands.repo";
import { listVendor } from "@/features/vendors/server/vendor.repo";
import { getAdminProductDetail } from "@/features/products/server/product.repo";

export default async function Page({ params }: { params: { id: string } }) {
    const [product, brands, vendors, opts] = await Promise.all([
        getAdminProductDetail(params.id),
        listBrands(),
        listVendor(),
        getOptions(), // gom statusOptions, typeOptions, caseOptions, movementOptions, complicationOptions
    ]);

    return (
        <EditProductForm
            initial={product}
            brands={brands}
            vendors={vendors}
            statusOptions={opts.status}
            typeOptions={opts.type}
            caseOptions={opts.case}
            movementOptions={opts.movement}
            complicationOptions={opts.complication}
        />
    );
}
