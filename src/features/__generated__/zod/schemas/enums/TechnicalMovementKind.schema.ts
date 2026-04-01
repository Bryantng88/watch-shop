import * as z from 'zod';

export const TechnicalMovementKindSchema = z.enum(['UNKNOWN', 'BATTERY', 'MECHANICAL'])

export type TechnicalMovementKind = z.infer<typeof TechnicalMovementKindSchema>;