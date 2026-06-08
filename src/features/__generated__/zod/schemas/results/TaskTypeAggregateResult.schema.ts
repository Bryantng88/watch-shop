import * as z from 'zod';
export const TaskTypeAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    code: z.number(),
    name: z.number(),
    description: z.number(),
    domain: z.number(),
    legacyKind: z.number(),
    defaultPriority: z.number(),
    completionMode: z.number(),
    completionRuleKey: z.number(),
    isActive: z.number(),
    sortOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    tasks: z.number()
  }).optional(),
  _sum: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    completionRuleKey: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    code: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    completionRuleKey: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});