import * as z from 'zod';

export const CategorySchema = z.enum(['ENTRY', 'MID_RANGE', 'LUXURY'])

export type Category = z.infer<typeof CategorySchema>;