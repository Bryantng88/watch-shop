import * as z from 'zod';

export const ReserveTypeSchema = z.enum(['NONE', 'COD_HOLD', 'DEPOSIT_HOLD'])

export type ReserveType = z.infer<typeof ReserveTypeSchema>;