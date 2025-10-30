import * as z from 'zod';

export const ProductScalarFieldEnumSchema = z.enum(['id', 'slug', 'title', 'primaryImageUrl', 'contentStatus', 'type', 'priceVisibility', 'brandId', 'seoTitle', 'seoDescription', 'isStockManaged', 'maxQtyPerOrder', 'publishedAt', 'vendorId', 'createdAt', 'updatedAt', 'tag'])

export type ProductScalarFieldEnum = z.infer<typeof ProductScalarFieldEnumSchema>;