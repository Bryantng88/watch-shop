import * as z from 'zod';

export const ProductStatusSchema = z.enum(['AVAILABLE', 'IN_SERVICE', 'CONSIGNED_FROM', 'CONSIGNED_TO', 'HOLD', 'SOLD'])

export type ProductStatus = z.infer<typeof ProductStatusSchema>;