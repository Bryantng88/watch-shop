import * as z from 'zod';

export const WatchSaleStateSchema = z.enum(['DRAFT', 'READY', 'HOLD', 'SOLD', 'CONSIGNED_TO', 'IN_SERVICE'])

export type WatchSaleState = z.infer<typeof WatchSaleStateSchema>;