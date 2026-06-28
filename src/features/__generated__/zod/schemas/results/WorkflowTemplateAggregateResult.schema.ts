import * as z from 'zod';
export const WorkflowTemplateAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    name: z.number(),
    description: z.number(),
    status: z.number(),
    strategy: z.number(),
    ownerType: z.number(),
    ownerId: z.number(),
    isSystem: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    conditions: z.number(),
    actions: z.number(),
    executions: z.number(),
    tags: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    ownerType: z.string().nullable(),
    ownerId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    name: z.string().nullable(),
    description: z.string().nullable(),
    ownerType: z.string().nullable(),
    ownerId: z.string().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()});