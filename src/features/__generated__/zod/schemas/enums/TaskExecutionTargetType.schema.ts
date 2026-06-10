import * as z from 'zod';

export const TaskExecutionTargetTypeSchema = z.enum(['WATCH', 'ORDER', 'SHIPMENT', 'PAYMENT', 'SERVICE_REQUEST', 'TECHNICAL_ISSUE', 'ACQUISITION', 'WORK_CASE'])

export type TaskExecutionTargetType = z.infer<typeof TaskExecutionTargetTypeSchema>;