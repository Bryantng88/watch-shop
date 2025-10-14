// features/catalog/server/queries.ts
import { Prisma } from '@prisma/client';
import prisma from '@/server/db/client';
import type { Filters, Sort } from '../types';
import { complications } from '@/constants/constants';

const PAGE_SIZE = 12;

export async function listProducts(filters: Filters) {
    const page = Math.max(1, filters.page ?? 1);
    const take = PAGE_SIZE;
    const skip = (page - 1) * take;
    const sort = filters.sort ?? 'default';

    console.log("in ra size trong query: " + filters.categories, filters.sizes, filters.complications)

    /* ----- where cho Product ----- */
    const whereP: Prisma.ProductWhereInput = {
        ...(filters.complications?.length
            ? {
                watchSpec: {
                    is: {
                        complication: {
                            some: { id: { in: filters.complications } },
                            // hoặc nếu bạn lọc theo id:
                            // some: { id: { in: filters.complications } },
                        },
                    },
                },
            }
            : {}),
        // brand
        ...(filters.brands?.length ? { brandId: { in: filters.brands } } : {}),
        // category / type (enum)
        ...(filters.categories?.length ? { type: { in: filters.categories as any } } : {}),
        ...(filters.sizes?.length
            ? { watchSpec: { is: { sizeCategory: { in: filters.sizes } } } }
            : {}),
        // TODO: thêm các where khác trên Product (style, complication, …) nếu có cột/quan hệ
    };

    /* ----- where cho ProductVariant (giá, biến thể…) ----- */
    const wherePV: Prisma.ProductVariantWhereInput = {
        isActive: true,
        ...(filters.priceMin != null || filters.priceMax != null
            ? {
                price: {
                    ...(filters.priceMin != null ? { gte: new Prisma.Decimal(filters.priceMin) } : {}),
                    ...(filters.priceMax != null ? { lte: new Prisma.Decimal(filters.priceMax) } : {}),
                },
            }
            : {}),
        // TODO: thêm dialColor / material / caseSize… nếu có cột tương ứng
    };

    /* ----- bước 1: groupBy để distinct product + sort theo giá ----- */
    // Chỉ lấy các productId có variant match wherePV và product match whereP
    // Turndown: groupBy không join Product; ta filter product ở bước 2
    const argsLow = {
        by: ['productId'] as const,
        where: wherePV,                  // kiểu: Prisma.ProductVariantWhereInput
        _min: { price: true },
        orderBy: [{ _min: { price: 'asc' } }], // hoặc 1 object cũng được
        skip,
        take,
    } satisfies Prisma.ProductVariantGroupByArgs;

    const groupedLow = await prisma.productVariant.groupBy(argsLow);


    const argsHigh = {
        by: ['productId'] as const,
        where: wherePV,
        _max: { price: true },
        orderBy: [{ _max: { price: 'desc' } }],
        skip,
        take,
    } satisfies Prisma.ProductVariantGroupByArgs;

    const groupedHigh = await prisma.productVariant.groupBy(argsHigh);

    const ids = (sort === 'low' ? groupedLow : groupedHigh).map(g => g.productId);

    /* ----- bước 1b: tổng số product khớp filter (distinct theo product) ----- */
    // đếm distinct productId khớp wherePV & whereP
    const distinctProducts = await prisma.product.findMany({
        where: {
            ...whereP,
            variants: { some: wherePV },
        },
        select: { id: true },
    });
    const total = distinctProducts.length;

    /* ----- bước 2: lấy product theo ids giữ nguyên thứ tự ----- */
    const products = await prisma.product.findMany({
        where: { id: { in: ids }, ...whereP },
        select: {
            // lấy 1 variant rẻ nhất để hiển thị giá (hoặc ảnh nếu bạn lưu ảnh ở variant)
            id: true,
            slug: true,
            variants: {
                where: wherePV,
                orderBy: { price: 'asc' },
                take: 1,
                select: { price: true },
            },
            title: true,
            primaryImageUrl: true, // có sẵn rồi
            brand: { select: { id: true, name: true } },
            status: true,
            watchSpec: {
                select: {
                    sizeCategory: true,                 // 👈 1 giá trị duy nhất
                    complication: { select: { id: true, name: true } },

                },
            },
        }
        ,
    });



    const orderMap = new Map(ids.map((id, i) => [id, i]));
    // map theo thứ tự từ ids
    const ordered = products
        .map(p => {
            const img = p.primaryImageUrl;
            return {
                id: p.id,
                title: p.title,
                slug: p.slug,
                brand: p.brand?.name,
                complications: p.watchSpec?.complication,
                price: p.variants?.[0]?.price ? Number(p.variants[0].price) : null,
                primaryImageUrl: img,  // <- build URL từ key
                status: p.status,
                sizeCategory: p.watchSpec?.sizeCategory
            };
        }
        )
        .sort((a, b) => orderMap.get(a.id)! - orderMap.get(b.id)!);



    return { items: ordered, total, pageSize: take };

}
