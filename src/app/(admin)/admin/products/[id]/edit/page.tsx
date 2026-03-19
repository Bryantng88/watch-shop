import EditProductForm from "../../_client/EditProductForm";

import { getOptions } from "@/features/products/components/options";

import { listBrands } from "@/features/catalog/server/brands.repo";
import { listVendor } from "@/features/vendors/server/vendor.repo";
import { getAdminProductDetail } from "@/features/products/server/product.repo";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [product, brands, vendors, opts] = await Promise.all([
        getAdminProductDetail(id),
        listBrands(),
        listVendor(),
        getOptions(),
    ]);
    const parse = JSON.parse(JSON.stringify(product));

    return (
        <EditProductForm
            initial={parse}
            brands={brands}
            vendors={vendors}
            productStatusOptions={opts.productStatus}
            availabilityStatusOptions={opts.availabilityStatus}
            typeOptions={opts.type}
            caseOptions={opts.case}
            movementOptions={opts.movement}
            caseMaterialOptions={opts.caseMaterial}
            genderOptions={opts.gender}
            strapOptions={opts.strap}
            glassOptions={opts.glass}
            goldColorOptions={opts.goldColor}
            complicationOptions={opts.complication}
        />
    );
}
