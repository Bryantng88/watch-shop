import * as z from 'zod';

export const StrapVariantSpecScalarFieldEnumSchema = z.enum(['variantId', 'color', 'material', 'quickRelease', 'createdAt', 'updatedAt', 'lugWidthMM', 'buckleWidthMM', 'originType', 'brandName', 'leatherType', 'surface', 'inventoryPolicy', 'claspType', 'claspWidthMM', 'claspOriginType', 'finish', 'lengthClass', 'minStockQty', 'targetStockQty', 'braceletReference', 'defaultFullLinks', 'defaultHalfLinks', 'defaultEndLinks'])

export type StrapVariantSpecScalarFieldEnum = z.infer<typeof StrapVariantSpecScalarFieldEnumSchema>;