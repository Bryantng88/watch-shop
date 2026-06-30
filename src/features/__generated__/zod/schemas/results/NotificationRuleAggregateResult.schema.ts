import * as z from 'zod';
export const NotificationRuleAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    eventKey: z.number(),
    enabled: z.number(),
    channel: z.number(),
    recipientGroupKey: z.number(),
    conditionJson: z.number(),
    titleTemplate: z.number(),
    messageTemplate: z.number(),
    priority: z.number(),
    createdAt: z.number(),
    updatedAt: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    eventKey: z.string().nullable(),
    channel: z.string().nullable(),
    recipientGroupKey: z.string().nullable(),
    titleTemplate: z.string().nullable(),
    messageTemplate: z.string().nullable(),
    priority: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    eventKey: z.string().nullable(),
    channel: z.string().nullable(),
    recipientGroupKey: z.string().nullable(),
    titleTemplate: z.string().nullable(),
    messageTemplate: z.string().nullable(),
    priority: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});