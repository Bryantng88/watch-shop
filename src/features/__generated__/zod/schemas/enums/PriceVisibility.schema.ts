import * as z from 'zod';

export const PriceVisibilitySchema = z.enum(['SHOW', 'HIDE'])

export type PriceVisibility = z.infer<typeof PriceVisibilitySchema>;