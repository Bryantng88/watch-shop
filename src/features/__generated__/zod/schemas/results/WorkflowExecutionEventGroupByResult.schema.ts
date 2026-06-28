import * as z from 'zod';
export const WorkflowExecutionEventGroupByResultSchema = z.array(z.object({
  id: z.string(),
  executionId: z.string(),
  targetType: z.string(),
  targetId: z.string(),
  eventKey: z.string(),
  eventLogId: z.string(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    executionId: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    eventKey: z.number(),
    eventLogId: z.number(),
    createdAt: z.number(),
    execution: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    executionId: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    eventKey: z.string().nullable(),
    eventLogId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    executionId: z.string().nullable(),
    targetType: z.string().nullable(),
    targetId: z.string().nullable(),
    eventKey: z.string().nullable(),
    eventLogId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));