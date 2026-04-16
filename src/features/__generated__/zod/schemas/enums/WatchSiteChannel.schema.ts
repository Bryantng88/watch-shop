import * as z from 'zod';

export const WatchSiteChannelSchema = z.enum(['AFFORDABLE', 'LUXURY'])

export type WatchSiteChannel = z.infer<typeof WatchSiteChannelSchema>;