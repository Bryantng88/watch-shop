import * as z from 'zod';

export const reservetypeSchema = z.enum(['NONE', 'COD_HOLD', 'DEPOSIT_HOLD'])

export type reservetype = z.infer<typeof reservetypeSchema>;