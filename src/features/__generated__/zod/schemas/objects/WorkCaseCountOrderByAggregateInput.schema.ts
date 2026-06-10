import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  refNo: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  scope: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional(),
  watchId: SortOrderSchema.optional(),
  categoryId: SortOrderSchema.optional(),
  raisedByUserId: SortOrderSchema.optional(),
  assignedToUserId: SortOrderSchema.optional(),
  triagedAt: SortOrderSchema.optional(),
  resolvedAt: SortOrderSchema.optional(),
  cancelledAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const WorkCaseCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.WorkCaseCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCountOrderByAggregateInput>;
export const WorkCaseCountOrderByAggregateInputObjectZodSchema = makeSchema();
