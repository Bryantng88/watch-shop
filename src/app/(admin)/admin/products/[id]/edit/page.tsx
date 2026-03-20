import EditProductForm from '../../_client/EditProductForm';

import { getOptions } from '../../_components/options';
import { prisma } from '@/server/db/client';
import { listBrands } from '@/features/catalog/server/brands.repo';
import { listVendor } from '@/features/vendors/server/vendor.repo';
import { getAdminProductDetail } from '@/features/products/server/product.repo';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [product, brands, vendors, opts, categories, strapInventory] = await Promise.all([
        getAdminProductDetail(id),
        listBrands(),
        listVendor(),
        getOptions(),
        prisma.productCategory.findMany({
            where: { isActive: true },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
            select: {
                id: true,
                name: true,
                scope: true,
            },
        }),
        prisma.product.findMany({
            where: {
                type: 'WATCH_STRAP' as any,
                variants: {
                    some: {
                        stockQty: { gt: 0 },
                    },
                },
            },
            orderBy: [{ updatedAt: 'desc' }, { title: 'asc' }],
            take: 200,
            select: {
                id: true,
                title: true,
                vendor: {
                    select: {
                        name: true,
                    },
                },
                variants: {
                    orderBy: [{ updatedAt: 'desc' }, { createdAt: 'asc' }],
                    take: 1,
                    select: {
                        id: true,
                        stockQty: true,
                        availabilityStatus: true,
                        price: true,
                        costPrice: true,
                        strapSpec: {
                            select: {
                                lugWidthMM: true,
                                buckleWidthMM: true,
                                color: true,
                                material: true,
                                quickRelease: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    const parse = JSON.parse(JSON.stringify(product));
    const strapInventoryOptions = strapInventory
        .map((item) => {
            const variant = item.variants?.[0];
            if (!variant?.id) return null;

            return {
                productId: item.id,
                variantId: variant.id,
                title: item.title,
                vendorName: item.vendor?.name ?? null,
                stockQty: Number(variant.stockQty ?? 0),
                availabilityStatus: variant.availabilityStatus ?? null,
                price: variant.price != null ? Number(variant.price) : null,
                costPrice: variant.costPrice != null ? Number(variant.costPrice) : null,
                strapSpec: variant.strapSpec
                    ? {
                        lugWidthMM: Number(variant.strapSpec.lugWidthMM ?? 0),
                        buckleWidthMM: Number(variant.strapSpec.buckleWidthMM ?? 0),
                        color: variant.strapSpec.color ?? null,
                        material: variant.strapSpec.material ?? null,
                        quickRelease: variant.strapSpec.quickRelease ?? null,
                    }
                    : null,
            };
        })
        .filter(Boolean);

    return (
        <EditProductForm
            initial={parse}
            brands={brands}
            vendors={vendors}
            productStatusOptions={opts.productStatus}
            typeOptions={opts.type}
            caseOptions={opts.case}
            movementOptions={opts.movement}
            caseMaterialOptions={opts.caseMaterial}
            genderOptions={opts.gender}
            strapOptions={opts.strap}
            glassOptions={opts.glass}
            goldColorOptions={opts.goldColor}
            complicationOptions={opts.complication}
            categoryOptions={categories}
            strapInventoryOptions={strapInventoryOptions as any}
        />
    );
}
