import * as z from 'zod';

export const GlassSchema = z.enum(['SAPPHIRE', 'ACRYLIC', 'MINERAL', 'HARDLEX', 'AR_COATED'])

export type Glass = z.infer<typeof GlassSchema>;