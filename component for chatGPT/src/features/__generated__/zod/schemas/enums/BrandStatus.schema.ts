import * as z from 'zod';

export const BrandStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'HIDDEN'])

export type BrandStatus = z.infer<typeof BrandStatusSchema>;