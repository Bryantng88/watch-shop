import * as z from 'zod';

export const WatchStockStateSchema = z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'RESERVED'])

export type WatchStockState = z.infer<typeof WatchStockStateSchema>;