import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  source: SortOrderSchema.optional(),
  kind: SortOrderSchema.optional(),
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
<<<<<<< HEAD
  taskTypeId: SortOrderSchema.optional(),
=======
  workCaseId: SortOrderSchema.optional(),
>>>>>>> a011cbb2d4ad4063b85485297cbe895b7833bd15
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const TaskMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.TaskMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TaskMinOrderByAggregateInput>;
export const TaskMinOrderByAggregateInputObjectZodSchema = makeSchema();
