import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  domain: SortOrderSchema.optional(),
  taskTypeId: SortOrderSchema.optional(),
  mode: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  dueAt: SortOrderSchema.optional(),
  startedAt: SortOrderSchema.optional(),
  completedAt: SortOrderSchema.optional(),
  cancelledAt: SortOrderSchema.optional(),
  createdByUserId: SortOrderSchema.optional(),
  assignedToUserId: SortOrderSchema.optional(),
  completedByUserId: SortOrderSchema.optional(),
  cancelledByUserId: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  shipmentId: SortOrderSchema.optional(),
  acquisitionId: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  technicalIssueId: SortOrderSchema.optional(),
  paymentId: SortOrderSchema.optional(),
  workCaseId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskMaxOrderByAggregateInput>;
export const TaskMaxOrderByAggregateInputObjectZodSchema = makeSchema();
