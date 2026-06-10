import * as z from 'zod';

export const TaskDomainSchema = z.enum(['GENERAL', 'WATCH', 'ORDER', 'SHIPMENT', 'SERVICE', 'TECHNICAL_ISSUE', 'PAYMENT', 'ACQUISITION', 'WORK_CASE'])

export type TaskDomain = z.infer<typeof TaskDomainSchema>;