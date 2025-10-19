import * as z from 'zod';

export const MovementTypeSchema = z.enum(['AUTOMATIC', 'HAND_WOUND', 'QUARTZ', 'SOLAR', 'KINETIC', 'MECHAQUARTZ', 'SPRING_DRIVE', 'HYBRID'])

export type MovementType = z.infer<typeof MovementTypeSchema>;