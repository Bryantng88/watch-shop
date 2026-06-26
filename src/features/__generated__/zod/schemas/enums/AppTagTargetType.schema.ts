import * as z from 'zod';

export const AppTagTargetTypeSchema = z.enum(['TASK_ITEM', 'WATCH', 'ORDER', 'SERVICE_REQUEST', 'TECHNICAL_ISSUE', 'CUSTOMER', 'GENERAL'])

export type AppTagTargetType = z.infer<typeof AppTagTargetTypeSchema>;