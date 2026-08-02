import * as z from 'zod';

export const StrapOriginTypeSchema = z.enum(['OEM', 'AFTERMARKET', 'UNKNOWN'])

export type StrapOriginType = z.infer<typeof StrapOriginTypeSchema>;