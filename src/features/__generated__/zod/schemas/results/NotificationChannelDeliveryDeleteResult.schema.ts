import * as z from 'zod';
export const NotificationChannelDeliveryDeleteResultSchema = z.nullable(z.object({
  id: z.string(),
  dispatchId: z.string(),
  channel: z.string(),
  recipientGroupKey: z.string(),
  status: z.string(),
  errorMessage: z.string().optional(),
  payloadJson: z.unknown().optional(),
  sentAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
}));