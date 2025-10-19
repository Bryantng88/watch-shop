import * as z from 'zod';

export const GenderSchema = z.enum(['MEN', 'WOMEN', 'UNISEX'])

export type Gender = z.infer<typeof GenderSchema>;