import * as z from 'zod';

export const WatchPostStageSchema = z.enum(['PREPARING', 'READY', 'POSTED'])

export type WatchPostStage = z.infer<typeof WatchPostStageSchema>;