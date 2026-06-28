import * as z from 'zod';
export const WorkflowConditionGroupByResultSchema = z.array(z.object({
  id: z.string(),
  workflowId: z.string(),
  eventKey: z.string(),
  targetType: z.string(),
  sortOrder: z.number().int(),
  configJson: z.unknown(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    workflowId: z.number(),
    eventKey: z.number(),
    targetType: z.number(),
    sortOrder: z.number(),
    configJson: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    workflow: z.number()
  }).optional(),
  _sum: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    workflowId: z.string().nullable(),
    eventKey: z.string().nullable(),
    targetType: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    workflowId: z.string().nullable(),
    eventKey: z.string().nullable(),
    targetType: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));