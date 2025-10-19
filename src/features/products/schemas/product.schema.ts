// src/features/products/schemas/product.schema.ts
import { z } from 'zod';
import { ProductArgsObjectSchema, ProductCreateInputObjectSchema, ProductUpdateInputObjectSchema } from '@/features/__generated__/zod/schemas';
// Schema cho body create/update Product (tối giản – chỉnh theo model của bạn)
export const CreateProductSchema = ProductCreateInputObjectSchema
export const ProductSchema = ProductArgsObjectSchema
export const UpdateProductSchema = ProductUpdateInputObjectSchema

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
