import * as z from 'zod';

export const WatchGoldTreatmentSchema = z.enum(['SOLID_GOLD', 'CAPPED_GOLD', 'GOLD_PLATED', 'GOLD_VERMEIL', 'GOLD_FILLED'])

export type WatchGoldTreatment = z.infer<typeof WatchGoldTreatmentSchema>;