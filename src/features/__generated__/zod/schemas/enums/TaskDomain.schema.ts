import * as z from 'zod';

export const TaskDomainSchema = z.enum(['GENERAL', 'WATCH', 'ORDER', 'SHIPMENT', 'SERVICE', 'PAYMENT', 'ACQUISITION'])

export type TaskDomain = z.infer<typeof TaskDomainSchema>;