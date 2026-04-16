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

const DecimalLike = z.union([z.number(), z.string().regex(/^\d+(\.\d+)?$/)]).transform((v) =>
    typeof v === "string" ? v : v.toString()
);
export const WatchSpecInputSchema = z
    .object({
        model: z.string().min(1).optional(),
        year: z.string().optional(),
        caseType: z.string().optional(),
        categoryIds: z.array(z.string()).optional(),
        gender: z.string().optional(),
        length: DecimalLike.optional(),
        width: DecimalLike.optional(),
        thickness: DecimalLike.optional(),
        movement: z.string().optional(),
        caliber: z.string().optional(),
        caseMaterial: z.string().optional(),
        dialColor: z.string().optional(),
        strap: z.string().optional(),
        glass: z.string().optional(),
        boxIncluded: z.boolean().optional(),
        bookletIncluded: z.boolean().optional(),
    })
    .partial();

export const VariantInputSchema = z.object({
    id: z.string().optional(), // for update/upsert
    sku: z.string().optional(),
    name: z.string().optional(),
    price: DecimalLike.optional(),
    stockQty: z.number().int().min(0).optional(),
    isStockManaged: z.boolean().optional(),
    isActive: z.boolean().optional(),
});


export const AcquisitionForCreateSchema = z.object({
    // If you want to attach to an existing acquisition, pass acquisitionId.
    acquisitionId: z.string().optional(),
    // Otherwise a new draft acquisition will be created for this vendor.
    vendorId: z.string().optional(),
    quantity: z.number().int().min(1).default(1),
    unitCost: DecimalLike.optional(),
    currency: z.string().optional(),
    // Which variant to attach in the acquisition item (defaults to first created)
    variantId: z.string().optional(),
});


export const ProductBaseSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).optional(),
    status: z.string().optional(), // Prisma enum string, validated server-side
    type: z.string().optional(),
    brandId: z.string().optional(),
    vendorId: z.string().optional(),
    primaryImageUrl: z.string().url().optional().nullable(),
    seoTitle: z.string().optional().nullable(),
    seoDescription: z.string().optional().nullable(),
    isStockManaged: z.boolean().optional(),
    maxQtyPerOrder: z.number().int().min(1).optional(),
    tag: z.string().optional(),
});


export const CreateProductWithAcqSchema = z.object({
    product: ProductBaseSchema,
    watchSpec: WatchSpecInputSchema.optional(),
    variants: z.array(VariantInputSchema).min(1),
    acquisition: AcquisitionForCreateSchema.optional(),
});


export type CreateProductWithAcqDTO = z.infer<typeof CreateProductWithAcqSchema>;


export const UpdateProductWithAcqSchema = z.object({
    id: z.string(),
    product: ProductBaseSchema.partial(),
    watchSpec: WatchSpecInputSchema.optional(),
    variants: z.array(VariantInputSchema).optional(),
});


export type UpdateProductWithAcqDTO = z.infer<typeof UpdateProductWithAcqSchema>;