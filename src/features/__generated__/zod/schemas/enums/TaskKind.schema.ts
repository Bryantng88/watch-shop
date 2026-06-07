import * as z from 'zod';

export const TaskKindSchema = z.enum(['PERSONAL', 'WATCH_CONTENT', 'WATCH_IMAGE', 'WATCH_REVIEW', 'ORDER_FOLLOW_UP', 'PAYMENT_FOLLOW_UP', 'SHIPMENT_FOLLOW_UP', 'SHIPMENT_RETURN', 'SERVICE_FOLLOW_UP', 'TECHNICAL_ISSUE_FOLLOW_UP', 'ACQUISITION_FOLLOW_UP', 'OTHER'])

export type TaskKind = z.infer<typeof TaskKindSchema>;