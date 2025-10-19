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
export const AcquisitionItemCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemCountOrderByAggregateInput>;
export const AcquisitionItemCountOrderByAggregateInputObjectZodSchema = makeSchema();
