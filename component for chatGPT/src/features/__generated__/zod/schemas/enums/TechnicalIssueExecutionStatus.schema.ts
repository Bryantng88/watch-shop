import * as z from 'zod';

export const TechnicalIssueExecutionStatusSchema = z.enum(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED'])

export type TechnicalIssueExecutionStatus = z.infer<typeof TechnicalIssueExecutionStatusSchema>;