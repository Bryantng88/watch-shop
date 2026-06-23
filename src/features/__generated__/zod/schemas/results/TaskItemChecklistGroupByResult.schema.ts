import * as z from 'zod';
export const TaskItemChecklistGroupByResultSchema = z.array(z.object({
  id: z.string(),
  taskItemId: z.string(),
  title: z.string(),
  note: z.string(),
  isDone: z.boolean(),
  sortOrder: z.number().int(),
  doneAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  taskId: z.string(),
  _count: z.object({
    id: z.number(),
    taskItemId: z.number(),
    title: z.number(),
    note: z.number(),
    isDone: z.number(),
    sortOrder: z.number(),
    doneAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    taskItem: z.number(),
    Task: z.number(),
    taskId: z.number()
  }).optional(),
  _sum: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _avg: z.object({
    sortOrder: z.number().nullable()
  }).nullable().optional(),
  _min: z.object({
    id: z.string().nullable(),
    taskItemId: z.string().nullable(),
    title: z.string().nullable(),
    note: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    doneAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    taskId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    taskItemId: z.string().nullable(),
    title: z.string().nullable(),
    note: z.string().nullable(),
    sortOrder: z.number().int().nullable(),
    doneAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    taskId: z.string().nullable()
  }).nullable().optional()
}));