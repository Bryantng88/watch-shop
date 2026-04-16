import * as z from 'zod';

export const ProductVariantScalarFieldEnumSchema = z.enum(['id', 'productId', 'sku', 'name', 'price', 'stockQty', 'isStockManaged', 'maxQtyPerOrder', 'createdAt', 'updatedAt', 'availabilityStatus', 'listPrice', 'discountType', 'discountValue', 'salePrice', 'saleStartsAt', 'saleEndsAt', 'costPrice'])

export type ProductVariantScalarFieldEnum = z.infer<typeof ProductVariantScalarFieldEnumSchema>;