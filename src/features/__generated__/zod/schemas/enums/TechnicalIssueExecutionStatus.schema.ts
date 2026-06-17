import * as z from 'zod';

export const TechnicalIssueExecutionStatusSchema = z.enum(['CONFIRMED', 'OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED'])

export type TechnicalIssueExecutionStatus = z.infer<typeof TechnicalIssueExecutionStatusSchema>;