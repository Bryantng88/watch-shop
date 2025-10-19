import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  acquisitionId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  variantId: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  unitCost: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  sourceOrderItemId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const AcquisitionItemMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemMaxOrderByAggregateInput>;
export const AcquisitionItemMaxOrderByAggregateInputObjectZodSchema = makeSchema();
