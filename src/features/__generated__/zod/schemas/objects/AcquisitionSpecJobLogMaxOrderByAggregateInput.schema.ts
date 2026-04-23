import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionSpecJobId: SortOrderSchema.optional(),
  acquisitionItemId: SortOrderSchema.optional(),
  acquisitionId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  stage: SortOrderSchema.optional(),
  level: SortOrderSchema.optional(),
  message: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const AcquisitionSpecJobLogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogMaxOrderByAggregateInput>;
export const AcquisitionSpecJobLogMaxOrderByAggregateInputObjectZodSchema = makeSchema();
