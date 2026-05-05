import * as z from 'zod';

export const WatchStrapComponentSourceSchema = z.enum(['KEEP_CURRENT', 'FROM_STOCK'])

export type WatchStrapComponentSource = z.infer<typeof WatchStrapComponentSourceSchema>;