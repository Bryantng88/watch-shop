import * as z from 'zod';

export const PartTypeSchema = z.enum(['GLASS', 'RUBBER_GASKET', 'SRAP', 'BUCKLE', 'SPRING_BAR', 'BATTERY', 'MOVEMENT_PART', 'OTHER', 'BEZEL', 'INSERT'])

export type PartType = z.infer<typeof PartTypeSchema>;