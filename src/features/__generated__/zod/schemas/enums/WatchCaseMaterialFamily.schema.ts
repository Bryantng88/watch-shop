import * as z from 'zod';

export const WatchCaseMaterialFamilySchema = z.enum(['STAINLESS_STEEL', 'TITANIUM', 'TUNGSTEN', 'CERAMIC', 'CARBON', 'GOLD', 'PLATINUM', 'SILVER', 'BRASS', 'OTHER'])

export type WatchCaseMaterialFamily = z.infer<typeof WatchCaseMaterialFamilySchema>;
