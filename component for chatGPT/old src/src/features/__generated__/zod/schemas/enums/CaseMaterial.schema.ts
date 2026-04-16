import * as z from 'zod';

export const CaseMaterialSchema = z.enum(['STAINLESS_STEEL', 'TITANIUM', 'CERAMIC', 'CARBON', 'GOLD', 'PLATINUM', 'SILVER', 'BRASS', 'TWO_TONE', 'OTHER'])

export type CaseMaterial = z.infer<typeof CaseMaterialSchema>;