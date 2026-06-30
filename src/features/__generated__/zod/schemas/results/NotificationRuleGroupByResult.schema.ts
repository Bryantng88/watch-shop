import * as z from 'zod';
export const NotificationRuleGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  eventKey: z.string(),
  enabled: z.boolean(),
  channel: z.string(),
  recipientGroupKey: z.string(),
  conditionJson: z.unknown(),
  titleTemplate: z.string(),
  messageTemplate: z.string(),
  priority: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
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
  }).nullable().optional()
}));