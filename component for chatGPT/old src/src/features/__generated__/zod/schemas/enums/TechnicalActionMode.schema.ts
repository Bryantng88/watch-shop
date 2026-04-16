import * as z from 'zod';

export const TechnicalActionModeSchema = z.enum(['NONE', 'INTERNAL', 'VENDOR'])

export type TechnicalActionMode = z.infer<typeof TechnicalActionModeSchema>;