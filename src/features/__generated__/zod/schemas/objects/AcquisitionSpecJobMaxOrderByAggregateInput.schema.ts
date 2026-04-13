import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionItemId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  attempts: SortOrderSchema.optional(),
  lastError: SortOrderSchema.optional(),
  startedAt: SortOrderSchema.optional(),
  finishedAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  runAfter: SortOrderSchema.optional(),
  priority: SortOrderSchema.optional()
}).strict();
export const AcquisitionSpecJobMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobMaxOrderByAggregateInput>;
export const AcquisitionSpecJobMaxOrderByAggregateInputObjectZodSchema = makeSchema();
