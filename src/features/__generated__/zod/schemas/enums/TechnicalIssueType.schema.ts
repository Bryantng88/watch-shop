import * as z from 'zod';

export const TechnicalIssueTypeSchema = z.enum(['CHECK', 'SERVICE', 'REPAIR', 'REPLACE', 'OBSERVATION'])

export type TechnicalIssueType = z.infer<typeof TechnicalIssueTypeSchema>;