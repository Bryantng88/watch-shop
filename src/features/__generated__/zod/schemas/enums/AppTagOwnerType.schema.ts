import * as z from 'zod';

export const AppTagOwnerTypeSchema = z.enum(['TASK', 'WATCH', 'ORDER', 'SERVICE_REQUEST', 'TECHNICAL_ISSUE', 'CUSTOMER', 'GENERAL'])

export type AppTagOwnerType = z.infer<typeof AppTagOwnerTypeSchema>;