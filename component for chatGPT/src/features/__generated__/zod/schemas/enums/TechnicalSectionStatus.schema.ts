import * as z from 'zod';

export const TechnicalSectionStatusSchema = z.enum(['GOOD', 'ISSUE'])

export type TechnicalSectionStatus = z.infer<typeof TechnicalSectionStatusSchema>;