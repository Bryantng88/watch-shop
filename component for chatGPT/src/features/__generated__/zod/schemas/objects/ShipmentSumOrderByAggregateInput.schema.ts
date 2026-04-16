import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  shippingFee: SortOrderSchema.optional()
}).strict();
export const ShipmentSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentSumOrderByAggregateInput>;
export const ShipmentSumOrderByAggregateInputObjectZodSchema = makeSchema();
