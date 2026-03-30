import * as z from 'zod';

export const ProductStatusSchema = z.enum(['DRAFT', 'POSTED', 'IN_SERVICE', 'AVAILABLE', 'CONSIGNED_FROM', 'CONSIGNED_TO', 'HOLD', 'SOLD'])

export type ProductStatus = z.infer<typeof ProductStatusSchema>;