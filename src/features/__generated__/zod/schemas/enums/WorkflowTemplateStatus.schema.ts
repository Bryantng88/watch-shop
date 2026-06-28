import * as z from 'zod';

export const WorkflowTemplateStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED'])

export type WorkflowTemplateStatus = z.infer<typeof WorkflowTemplateStatusSchema>;