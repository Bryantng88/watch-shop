// src/features/products/schemas/product.schema.ts
import { z } from 'zod';

// Schema cho body create/update Product (tối giản – chỉnh theo model của bạn)
export const CreateProductSchema = z.object({
    title: z.string().min(1),
    slug: z.string().optional(),
    price: z.number().int().nonnegative().nullable().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']).default('ACTIVE'),
    primaryImageUrl: z.string().url().nullable().optional(),
    brandId: z.string().nullable().optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Schema parse query string -> Filters
export const FiltersSchema = z.object({
    page: z.coerce.number().int().positive().optional(),
    sort: z.enum(['default', 'low', 'high']).optional(),
    brands: z.union([z.string(), z.array(z.string())]).optional(),
    sizes: z.union([z.string(), z.array(z.string())]).optional(),
    complications: z.union([z.string(), z.array(z.string())]).optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    priceMin: z.coerce.number().nonnegative().optional(),
    priceMax: z.coerce.number().nonnegative().optional(),
})
    .transform((q) => ({
        ...q,
        // chuẩn hoá đơn -> mảng
        brands: q.brands ? ([] as string[]).concat(q.brands as any) : undefined,
        sizes: q.sizes ? ([] as string[]).concat(q.sizes as any) : undefined,
        complications: q.complications ? ([] as string[]).concat(q.complications as any) : undefined,
        categories: q.categories ? ([] as string[]).concat(q.categories as any) : undefined,
    }));
