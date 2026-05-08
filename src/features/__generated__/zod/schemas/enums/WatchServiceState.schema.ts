import * as z from 'zod';

export const WatchServiceStateSchema = z.enum(['NOT_REQUIRED', 'PENDING', 'IN_SERVICE', 'DONE'])

export type WatchServiceState = z.infer<typeof WatchServiceStateSchema>;