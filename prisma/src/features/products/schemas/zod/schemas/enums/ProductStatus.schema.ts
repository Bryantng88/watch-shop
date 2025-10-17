import * as z from 'zod';

export const ProductStatusSchema = z.enum(['ACTIVE', 'HOLD', 'SOLD', 'CONSIGNED', 'HIDDEN'])

export type ProductStatus = z.infer<typeof ProductStatusSchema>;