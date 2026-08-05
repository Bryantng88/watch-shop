import * as z from 'zod';
export const IntegrationIngressReceiptAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    channel: z.number(),
    keyId: z.number(),
    nonce: z.number(),
    eventId: z.number(),
    eventType: z.number(),
    requestHash: z.number(),
    status: z.number(),
    responseJson: z.number(),
    lastError: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    expiresAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    channel: z.string().nullable(),
    keyId: z.string().nullable(),
    nonce: z.string().nullable(),
    eventId: z.string().nullable(),
    eventType: z.string().nullable(),
    requestHash: z.string().nullable(),
    status: z.string().nullable(),
    lastError: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    expiresAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    channel: z.string().nullable(),
    keyId: z.string().nullable(),
    nonce: z.string().nullable(),
    eventId: z.string().nullable(),
    eventType: z.string().nullable(),
    requestHash: z.string().nullable(),
    status: z.string().nullable(),
    lastError: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    expiresAt: z.date().nullable()
  }).nullable().optional()});