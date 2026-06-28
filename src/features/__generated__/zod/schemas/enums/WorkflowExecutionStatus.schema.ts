import * as z from 'zod';

export const WorkflowExecutionStatusSchema = z.enum(['WAITING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'])

export type WorkflowExecutionStatus = z.infer<typeof WorkflowExecutionStatusSchema>;