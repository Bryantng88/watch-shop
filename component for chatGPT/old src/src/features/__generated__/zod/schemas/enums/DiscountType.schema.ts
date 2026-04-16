import * as z from 'zod';

export const DiscountTypeSchema = z.enum(['PERCENT', 'AMOUNT'])

export type DiscountType = z.infer<typeof DiscountTypeSchema>;