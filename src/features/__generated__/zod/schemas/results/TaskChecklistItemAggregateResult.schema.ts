import * as z from 'zod';
export const TaskChecklistItemAggregateResultSchema = z.object({  _count: z.object({
    id: z.number(),
    taskId: z.number(),
    title: z.number(),
    note: z.number(),
    status: z.number(),
    priority: z.number(),
    dueAt: z.number(),
    assignedToUserId: z.number(),
    startedAt: z.number(),
    completedAt: z.number(),
    cancelledAt: z.number(),
    isDone: z.number(),
    sortOrder: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    task: z.number(),
    assignedToUser: z.number(),
    executions: z.number(),
    User: z.number(),
    userId: z.number()
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
    dueAt: z.date().nullable(),
    assignedToUserId: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    cancelledAt: z.date().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    userId: z.string().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    taskId: z.string().nullable(),
    title: z.string().nullable(),
    note: z.string().nullable(),
    dueAt: z.date().nullable(),
    assignedToUserId: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    cancelledAt: z.date().nullable(),
    sortOrder: z.number().int().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable(),
    userId: z.string().nullable()
  }).nullable().optional()});