import * as z from 'zod';
export const WorkflowTemplateGroupByResultSchema = z.array(z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ownerType: z.string(),
  ownerId: z.string(),
  isSystem: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
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
  }).nullable().optional()
}));