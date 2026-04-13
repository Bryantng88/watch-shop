import Link from 'next/link';
import { notFound } from 'next/navigation';

import EditProductForm from '../../_client/edit/EditProductForm';
import { detail } from '../../_server/core/product.service'
import * as prodRepo from '../../_server/core/product.repo'
import { getOptions } from '../../_components/options';

import { prisma } from '@/server/db/client';
import { listBrands } from '@/features/catalog/server/brands.repo';
import { listVendor } from '@/features/vendors/server/vendor.repo';

export const metadata = { title: 'Sửa sản phẩm · Admin' };

function serialize(obj: any) {
    return JSON.parse(
        JSON.stringify(obj, (_key, value) => {
            if (value instanceof Date) return value.toISOString();
            if (typeof value === 'object' && value?._isDecimal) return Number(value);
            return value;
        })
    );
}

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [data, brands, vendors, opts, categoryOptions, strapInventoryOptions] =
        await Promise.all([
            detail(id),
            listBrands(),
            listVendor(),
            getOptions(),
            prodRepo.listActiveProductCategories(prisma),
            prodRepo.listAvailableStrapInventory(prisma),
        ]);

    if (!data?.product) notFound();

    return (
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 lg:px-6">
            <EditProductForm
                initial={serialize(data.product)}
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
    );
}
