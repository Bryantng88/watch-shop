import * as z from 'zod';

export const MechanicalPartGroupSchema = z.enum(['POWER', 'ESCAPEMENT', 'BALANCE', 'GEAR_TRAIN', 'SETTING', 'CASE_LINK', 'OTHER'])

export type MechanicalPartGroup = z.infer<typeof MechanicalPartGroupSchema>;