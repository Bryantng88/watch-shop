import * as z from 'zod';

export const WatchStrapSetTypeSchema = z.enum(['BRAND_ORIGINAL', 'COMPONENT'])

export type WatchStrapSetType = z.infer<typeof WatchStrapSetTypeSchema>;