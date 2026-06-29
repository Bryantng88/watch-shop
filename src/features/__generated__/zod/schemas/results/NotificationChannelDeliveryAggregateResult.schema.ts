import * as z from 'zod';
export const NotificationChannelDeliveryAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    dispatchId: z.number(),
    channel: z.number(),
    recipientGroupKey: z.number(),
    status: z.number(),
    errorMessage: z.number(),
    payloadJson: z.number(),
    sentAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    dispatchId: z.string().nullable(),
    channel: z.string().nullable(),
    recipientGroupKey: z.string().nullable(),
    status: z.string().nullable(),
    errorMessage: z.string().nullable(),
    sentAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    dispatchId: z.string().nullable(),
    channel: z.string().nullable(),
    recipientGroupKey: z.string().nullable(),
    status: z.string().nullable(),
    errorMessage: z.string().nullable(),
    sentAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});