import * as z from 'zod';

export const TaskExecutionTargetTypeSchema = z.enum(['WATCH', 'ORDER', 'PURCHASE_REQUEST', 'SHIPMENT', 'PAYMENT', 'SERVICE_REQUEST', 'TECHNICAL_ISSUE', 'ACQUISITION', 'WORK_CASE', 'STRAP'])

export type TaskExecutionTargetType = z.infer<typeof TaskExecutionTargetTypeSchema>;