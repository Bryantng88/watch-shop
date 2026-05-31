import * as z from 'zod';

export const ProductPostTargetScalarFieldEnumSchema = z.enum(['productId', 'postTargetId', 'createdAt'])

export type ProductPostTargetScalarFieldEnum = z.infer<typeof ProductPostTargetScalarFieldEnumSchema>;