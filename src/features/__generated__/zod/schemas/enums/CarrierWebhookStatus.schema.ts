import * as z from 'zod';

export const CarrierWebhookStatusSchema = z.enum(['RECEIVED', 'PROCESSED', 'IGNORED', 'FAILED'])

export type CarrierWebhookStatus = z.infer<typeof CarrierWebhookStatusSchema>;