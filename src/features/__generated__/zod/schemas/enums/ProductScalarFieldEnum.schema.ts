import * as z from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id', 'slug', 'title', 'status', 'primaryImageUrl', 'type', 'tag', 'brandId', 'seoTitle', 'seoDescription', 'isStockManaged', 'maxQtyPerOrder', 'publishedAt', 'vendorId', 'createdAt', 'updatedAt'])

export type ProductScalarFieldEnum = z.infer<typeof ProductScalarFieldEnumSchema>;