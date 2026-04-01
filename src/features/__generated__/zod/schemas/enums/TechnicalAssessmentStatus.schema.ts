import * as z from 'zod';

export const TechnicalAssessmentStatusSchema = z.enum(['DRAFT', 'COMPLETED'])

export type TechnicalAssessmentStatus = z.infer<typeof TechnicalAssessmentStatusSchema>;