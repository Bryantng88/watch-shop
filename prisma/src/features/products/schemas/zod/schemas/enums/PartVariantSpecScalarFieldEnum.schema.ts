import * as z from 'zod';

export const PartVariantSpecScalarFieldEnumSchema = z.enum(['variantId', 'partType'])

export type PartVariantSpecScalarFieldEnum = z.infer<typeof PartVariantSpecScalarFieldEnumSchema>;