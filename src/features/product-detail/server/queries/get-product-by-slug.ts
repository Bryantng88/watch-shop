import { notFound } from 'next/navigation';
import prisma from '@/server/db/client';
import ProductGallery from '@/features/catalog/components/product-gallery';
import ProductCard from '@/features/catalog/components/product-card';

export const revalidate = 60; // ISR tùy chọn

export async function getProductBySlug(slug: string) {
    // lấy 1 sản phẩm theo slug
    const product = await prisma.product.findUnique({
        where: { slug },
        select: {
            id: true,
            slug: true,
            title: true,
            status: true,
            primaryImageUrl: true,
            brand: { select: { id: true, name: true } },
            variants: {
                where: { isActive: true },
                orderBy: { price: 'asc' },
                take: 1,                          // biến thể rẻ nhất để hiển thị giá
                select: { id: true, price: true },
            },
            watchSpec: {
                select: {
                    sizeCategory: true,
                    caseMaterial: true,
                    dialColor: true,
                    strap: true,
                    model: true,
                    year: true,
                    complication: { select: { id: true, name: true } },
                },
            },
        },
    });

    return product;
}

export async function getRelatedProducts(curId: string, brandId?: string | null) {
    return prisma.product.findMany({
        where: {
            id: { not: curId },
            ...(brandId ? { brandId } : {}),
        },
        take: 3,
        select: {
            id: true, slug: true, title: true, primaryImageUrl: true,
            variants: { where: { isActive: true }, orderBy: { price: 'asc' }, take: 1, select: { price: true } },
            brand: { select: { name: true } },
            status: true,
            watchSpec: { select: { sizeCategory: true, complication: { select: { id: true, name: true } } } },
        },
    });
}
