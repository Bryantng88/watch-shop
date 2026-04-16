import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  shippingFee: SortOrderSchema.optional()
}).strict();
export const ShipmentAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentAvgOrderByAggregateInput>;
export const ShipmentAvgOrderByAggregateInputObjectZodSchema = makeSchema();
