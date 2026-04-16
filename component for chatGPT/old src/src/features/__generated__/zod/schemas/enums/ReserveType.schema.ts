import * as z from 'zod';

export const ReserveTypeSchema = z.enum(['NONE', 'COD', 'DEPOSIT'])

export type ReserveType = z.infer<typeof ReserveTypeSchema>;