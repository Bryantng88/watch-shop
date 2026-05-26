import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  totalAmount: SortOrderSchema.optional()
}).strict();
export const AcquisitionSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSumOrderByAggregateInput>;
export const AcquisitionSumOrderByAggregateInputObjectZodSchema = makeSchema();
