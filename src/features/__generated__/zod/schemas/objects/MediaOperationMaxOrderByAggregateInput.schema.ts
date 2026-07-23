import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  mediaObjectId: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sourceKey: SortOrderSchema.optional(),
  destinationKey: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  lastError: SortOrderSchema.optional(),
  requestedByUserId: SortOrderSchema.optional(),
  startedAt: SortOrderSchema.optional(),
  completedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const MediaOperationMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MediaOperationMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationMaxOrderByAggregateInput>;
export const MediaOperationMaxOrderByAggregateInputObjectZodSchema = makeSchema();
