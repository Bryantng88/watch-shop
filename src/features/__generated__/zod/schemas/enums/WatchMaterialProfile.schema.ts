import * as z from 'zod';

export const WatchMaterialProfileSchema = z.enum(['SINGLE_MATERIAL', 'BIMETAL', 'COATED', 'OTHER'])

export type WatchMaterialProfile = z.infer<typeof WatchMaterialProfileSchema>;