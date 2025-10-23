import * as z from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id', 'slug', 'title', 'status', 'primaryImageUrl', 'type', 'brandId', 'seoTitle', 'seoDescription', 'isStockManaged', 'maxQtyPerOrder', 'publishedAt', 'vendorId', 'createdAt', 'updatedAt', 'tag'])

export type ProductScalarFieldEnum = z.infer<typeof ProductScalarFieldEnumSchema>;