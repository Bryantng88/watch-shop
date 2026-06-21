import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  source: z.literal(true).optional(),
  taskTypeId: z.literal(true).optional(),
  status: z.literal(true).optional(),
  priority: z.literal(true).optional(),
  kind: z.literal(true).optional(),
  dueAt: z.literal(true).optional(),
  startedAt: z.literal(true).optional(),
  completedAt: z.literal(true).optional(),
  cancelledAt: z.literal(true).optional(),
  createdByUserId: z.literal(true).optional(),
  assignedToUserId: z.literal(true).optional(),
  completedByUserId: z.literal(true).optional(),
  cancelledByUserId: z.literal(true).optional(),
  watchId: z.literal(true).optional(),
  orderId: z.literal(true).optional(),
  shipmentId: z.literal(true).optional(),
  acquisitionId: z.literal(true).optional(),
  serviceRequestId: z.literal(true).optional(),
  technicalIssueId: z.literal(true).optional(),
  paymentId: z.literal(true).optional(),
  workCaseId: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional(),
  taskActionId: z.literal(true).optional(),
  _all: z.literal(true).optional()
}).strict();
export const TaskCountAggregateInputObjectSchema: z.ZodType<Prisma.TaskCountAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.TaskCountAggregateInputType>;
export const TaskCountAggregateInputObjectZodSchema = makeSchema();
