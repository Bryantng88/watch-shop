import * as z from 'zod';

export const ProductTypeSchema = z.enum(['WATCH_STRAP', 'BOX', 'ACCESSORIES', 'SERVICE', 'PARTS', 'WATCH'])

export type ProductType = z.infer<typeof ProductTypeSchema>;