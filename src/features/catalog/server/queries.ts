import { Prisma } from '@prisma/client'
import { prisma } from '@/server/db/client'

type Params = {
    page?: number
    pageSize?: number
    sort?: 'default' | 'low' | 'high' // low: rẻ->đắt, high: đắt->rẻ
    brand?: string                    // brandId (hoặc đổi sang slug tuỳ bạn)
}

export async function listProducts({
    page = 1,
    pageSize = 12,
    sort = 'default',
    brand,
}: Params) {
    const skip = (page - 1) * pageSize

    // ---- CASE 1: sort mặc định theo createdAt trực tiếp trên Product
    if (sort === 'default') {
        const where: Prisma.ProductWhereInput = {
            ...(brand ? { brandId: brand } : {}),
        }

        const [items, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: [{ createdAt: 'desc' }],
                include: { images: true, variants: true },
            }),
            prisma.product.count({ where }),
        ])

        return { items, total, pageSize }
    }

    const wherePV: Prisma.ProductVariantWhereInput = {
        price: { not: null },
        ...(brand ? { product: { brandId: brand } } : {}),
    }


    let grouped: Array<{ productId: string }>

    if (sort === 'low') {
        const argsLow = {
            by: ['productId'] as const,
            where: wherePV,
            _min: { price: true },
            orderBy: [{ _min: { price: 'asc' as const } }], // <-- MẢNG
            skip,
            take: pageSize,
        } satisfies Prisma.ProductVariantGroupByArgs;

        grouped = await prisma.productVariant.groupBy(argsLow);
    } else {
        const argsHigh = {
            by: ['productId'] as const,
            where: wherePV,
            _max: { price: true },
            orderBy: [{ _max: { price: 'desc' as const } }], // <-- MẢNG
            skip,
            take: pageSize,
        } satisfies Prisma.ProductVariantGroupByArgs;

        grouped = await prisma.productVariant.groupBy(argsHigh);
    }

    const ids = grouped.map(g => g.productId)

    // 2.2. đếm tổng số product thỏa điều kiện (distinct theo productId)
    const total = await prisma.product.count({
        where: {
            ...(brand ? { brandId: brand } : {}),
            variants: { some: { price: { not: null } } },
        },
    })

    if (ids.length === 0) return { items: [], total, pageSize }

    // 2.3. lấy product theo danh sách id và giữ nguyên thứ tự đã sort ở trên
    const products = await prisma.product.findMany({
        where: { id: { in: ids } },
        include: {
            images: true,
            // nếu muốn chỉ lấy variant rẻ nhất/cao nhất:
            // variants: { orderBy: { price: 'asc' }, take: 1 }
            variants: true,
        },
    })
    // map để trả về đúng thứ tự ids
    const byId = new Map(products.map(p => [p.id, p]))
    const items = ids.map(id => byId.get(id)!).filter(Boolean)

    return { items, total, pageSize }
}
