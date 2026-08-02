import * as z from 'zod';

export const ClaspVariantSpecScalarFieldEnumSchema = z.enum(['variantId', 'claspType', 'widthMM', 'originType', 'brandName', 'color', 'finish', 'minStockQty', 'targetStockQty', 'createdAt', 'updatedAt'])

export type ClaspVariantSpecScalarFieldEnum = z.infer<typeof ClaspVariantSpecScalarFieldEnumSchema>;