import * as z from 'zod';
export const NotificationDispatchAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    businessEventLogId: z.number(),
    ruleId: z.number(),
    eventKey: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    status: z.number(),
    errorMessage: z.number(),
    payloadJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    businessEventLogId: z.string().nullable(),
    ruleId: z.string().nullable(),
    eventKey: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    status: z.string().nullable(),
    errorMessage: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    businessEventLogId: z.string().nullable(),
    ruleId: z.string().nullable(),
    eventKey: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    status: z.string().nullable(),
    errorMessage: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});