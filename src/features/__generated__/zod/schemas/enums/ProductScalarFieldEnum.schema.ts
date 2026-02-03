import * as z from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id', 'slug', 'title', 'primaryImageUrl', 'type', 'priceVisibility', 'brandId', 'seoTitle', 'seoDescription', 'isStockManaged', 'maxQtyPerOrder', 'publishedAt', 'vendorId', 'createdAt', 'updatedAt', 'tag', 'status'])

export type ProductScalarFieldEnum = z.infer<typeof ProductScalarFieldEnumSchema>;