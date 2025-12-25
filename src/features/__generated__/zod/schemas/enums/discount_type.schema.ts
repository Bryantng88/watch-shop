import * as z from 'zod';

export const discount_typeSchema = z.enum(['PERCENT', 'AMOUNT'])

export type discount_type = z.infer<typeof discount_typeSchema>;