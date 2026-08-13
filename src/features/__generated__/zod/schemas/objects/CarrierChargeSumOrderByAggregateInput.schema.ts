import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  estimatedAmount: SortOrderSchema.optional(),
  chargedAmount: SortOrderSchema.optional()
}).strict();
export const CarrierChargeSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CarrierChargeSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeSumOrderByAggregateInput>;
export const CarrierChargeSumOrderByAggregateInputObjectZodSchema = makeSchema();
