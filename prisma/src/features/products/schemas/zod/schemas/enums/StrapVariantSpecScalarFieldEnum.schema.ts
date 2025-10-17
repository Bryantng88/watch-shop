import * as z from 'zod';

export const StrapVariantSpecScalarFieldEnumSchema = z.enum(['variantId', 'widthMM', 'lengthLabel', 'color', 'material', 'quickRelease', 'createdAt', 'updatedAt'])

export type StrapVariantSpecScalarFieldEnum = z.infer<typeof StrapVariantSpecScalarFieldEnumSchema>;