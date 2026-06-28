import * as z from 'zod';
export const WorkflowExecutionGroupByResultSchema = z.array(z.object({
  id: z.string(),
  workflowId: z.string(),
  actionTargetType: z.string(),
  actionTargetId: z.string(),
  errorMessage: z.string(),
  metadataJson: z.unknown(),
  startedAt: z.date(),
  completedAt: z.date(),
  failedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z.object({
    id: z.number(),
    workflowId: z.number(),
    actionTargetType: z.number(),
    actionTargetId: z.number(),
    status: z.number(),
    errorMessage: z.number(),
    metadataJson: z.number(),
    startedAt: z.number(),
    completedAt: z.number(),
    failedAt: z.number(),
    createdAt: z.number(),
    updatedAt: z.number(),
    workflow: z.number(),
    events: z.number()
  }).optional(),
  _min: z.object({
    id: z.string().nullable(),
    workflowId: z.string().nullable(),
    actionTargetType: z.string().nullable(),
    actionTargetId: z.string().nullable(),
    errorMessage: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    failedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional(),
  _max: z.object({
    id: z.string().nullable(),
    workflowId: z.string().nullable(),
    actionTargetType: z.string().nullable(),
    actionTargetId: z.string().nullable(),
    errorMessage: z.string().nullable(),
    startedAt: z.date().nullable(),
    completedAt: z.date().nullable(),
    failedAt: z.date().nullable(),
    createdAt: z.date().nullable(),
    updatedAt: z.date().nullable()
  }).nullable().optional()
}));