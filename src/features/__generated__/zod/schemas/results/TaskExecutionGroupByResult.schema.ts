import * as z from 'zod';
export const TaskExecutionGroupByResultSchema = z.array(z.object({
  id: z.string(),
  taskId: z.string(),
  targetId: z.string(),
  metadataJson: z.unknown(),
  note: z.string(),
  createdByUserId: z.string(),
  createdAt: z.date(),
  _count: z.object({
    id: z.number(),
    taskId: z.number(),
    targetType: z.number(),
    targetId: z.number(),
    actionType: z.number(),
    metadataJson: z.number(),
    note: z.number(),
    createdByUserId: z.number(),
    createdAt: z.number(),
    task: z.number(),
    createdByUser: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    taskId: z.string().nullable(),
    targetId: z.string().nullable(),
    note: z.string().nullable(),
    createdByUserId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    taskId: z.string().nullable(),
    targetId: z.string().nullable(),
    note: z.string().nullable(),
    createdByUserId: z.string().nullable(),
    createdAt: z.date().nullable()
  }).nullable().optional()
}));