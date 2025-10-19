import * as z from 'zod';

export const ProductVariantScalarFieldEnumSchema = z.enum(['id', 'productId', 'sku', 'name', 'price', 'stockQty', 'isStockManaged', 'isActive', 'maxQtyPerOrder', 'createdAt', 'updatedAt'])

export type ProductVariantScalarFieldEnum = z.infer<typeof ProductVariantScalarFieldEnumSchema>;