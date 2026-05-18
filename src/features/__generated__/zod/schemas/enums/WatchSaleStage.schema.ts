import * as z from 'zod';

export const WatchSaleStageSchema = z.enum(['DRAFT', 'PROCESSING', 'READY', 'HOLD', 'SOLD', 'CONSIGNED_TO', 'IN_SERVICE'])

export type WatchSaleStage = z.infer<typeof WatchSaleStageSchema>;