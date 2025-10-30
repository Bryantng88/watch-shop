import * as z from 'zod';

export const ProductVariantScalarFieldEnumSchema = z.enum(['id', 'productId', 'sku', 'name', 'price', 'stockQty', 'isStockManaged', 'maxQtyPerOrder', 'createdAt', 'updatedAt', 'availabilityStatuts'])

export type ProductVariantScalarFieldEnum = z.infer<typeof ProductVariantScalarFieldEnumSchema>;