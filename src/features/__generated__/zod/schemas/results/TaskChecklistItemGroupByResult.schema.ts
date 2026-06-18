import * as z from 'zod';
export const TaskChecklistItemGroupByResultSchema = z.array(z.object({
  id: z.string(),
  taskId: z.string(),
  title: z.string(),
  note: z.string(),
  isDone: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    taskId: z.number(),
    title: z.number(),
    note: z.number(),
    isDone: z.number(),
    sortOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    task: z.number(),
    executions: z.number()
  }).optional(),
  _sum: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    taskId: z.string().nullable(),
    title: z.string().nullable(),
    note: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    taskId: z.string().nullable(),
    title: z.string().nullable(),
    note: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));