import * as z from 'zod';

export const TechnicalAssessmentStatusSchema = z.enum(['DRAFT', 'COMPLETED', 'IN_PROGRESS', 'CANCELED'])

export type TechnicalAssessmentStatus = z.infer<typeof TechnicalAssessmentStatusSchema>;