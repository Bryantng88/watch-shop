import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  unitCost: SortOrderSchema.optional()
}).strict();
export const AcquisitionItemSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemSumOrderByAggregateInput>;
export const AcquisitionItemSumOrderByAggregateInputObjectZodSchema = makeSchema();
