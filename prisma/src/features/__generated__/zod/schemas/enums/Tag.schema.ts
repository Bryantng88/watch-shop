import * as z from 'zod';

export const TagSchema = z.enum(['PRE_OWNED', 'VINTAGE', 'NEW'])

export type Tag = z.infer<typeof TagSchema>;