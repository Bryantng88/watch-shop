import * as z from 'zod';

export const WatchStockStageSchema = z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'RESERVED'])

export type WatchStockStage = z.infer<typeof WatchStockStageSchema>;