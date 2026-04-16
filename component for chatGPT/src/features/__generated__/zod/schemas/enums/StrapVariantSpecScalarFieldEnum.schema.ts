import * as z from 'zod';

export const StrapVariantSpecScalarFieldEnumSchema = z.enum(['variantId', 'color', 'material', 'quickRelease', 'createdAt', 'updatedAt', 'lugWidthMM', 'buckleWidthMM'])

export type StrapVariantSpecScalarFieldEnum = z.infer<typeof StrapVariantSpecScalarFieldEnumSchema>;