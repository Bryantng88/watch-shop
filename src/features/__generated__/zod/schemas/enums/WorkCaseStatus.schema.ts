import * as z from 'zod';

export const WorkCaseStatusSchema = z.enum(['NEW', 'TRIAGED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'])

export type WorkCaseStatus = z.infer<typeof WorkCaseStatusSchema>;