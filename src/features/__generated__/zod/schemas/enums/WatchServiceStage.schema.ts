import * as z from 'zod';

export const WatchServiceStageSchema = z.enum(['NOT_REQUIRED', 'PENDING', 'IN_SERVICE', 'DONE'])

export type WatchServiceStage = z.infer<typeof WatchServiceStageSchema>;