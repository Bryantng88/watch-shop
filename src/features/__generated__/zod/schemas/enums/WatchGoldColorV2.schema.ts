import * as z from 'zod';

export const WatchGoldColorV2Schema = z.enum(['YELLOW', 'WHITE', 'ROSE', 'MIXED'])

export type WatchGoldColorV2 = z.infer<typeof WatchGoldColorV2Schema>;