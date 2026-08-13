import * as z from 'zod';
export const CarrierRequestAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    shipmentId: z.number(),
    carrierCode: z.number(),
    environment: z.number(),
    operation: z.number(),
    idempotencyKey: z.number(),
    requestJson: z.number(),
    responseJson: z.number(),
    status: z.number(),
    httpStatus: z.number(),
    externalOrderCode: z.number(),
    errorCode: z.number(),
    errorMessage: z.number(),
    attemptCount: z.number(),
    requestedAt: z.number(),
    completedAt: z.number(),
    shipment: z.number()
  }).optional(),
  _sum: z.object({
    httpStatus: z.number().nullable(),
    attemptCount: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    httpStatus: z.number().nullable(),
    attemptCount: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    carrierCode: z.string().nullable(),
    environment: z.string().nullable(),
    operation: z.string().nullable(),
    idempotencyKey: z.string().nullable(),
    httpStatus: z.number().int().nullable(),
    externalOrderCode: z.string().nullable(),
    errorCode: z.string().nullable(),
    errorMessage: z.string().nullable(),
    attemptCount: z.number().int().nullable(),
    requestedAt: z.date().nullable(),
    completedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    shipmentId: z.string().nullable(),
    carrierCode: z.string().nullable(),
    environment: z.string().nullable(),
    operation: z.string().nullable(),
    idempotencyKey: z.string().nullable(),
    httpStatus: z.number().int().nullable(),
    externalOrderCode: z.string().nullable(),
    errorCode: z.string().nullable(),
    errorMessage: z.string().nullable(),
    attemptCount: z.number().int().nullable(),
    requestedAt: z.date().nullable(),
    completedAt: z.date().nullable()
  }).nullable().optional()});