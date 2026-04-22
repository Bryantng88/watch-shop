import * as z from 'zod';

export const WatchSpecStatusSchema = z.enum(['PENDING', 'PARTIAL', 'READY', 'FAILED'])

export type WatchSpecStatus = z.infer<typeof WatchSpecStatusSchema>;