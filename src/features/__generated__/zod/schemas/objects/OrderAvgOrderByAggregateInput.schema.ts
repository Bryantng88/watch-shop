import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  subtotal: SortOrderSchema.optional(),
  shippingFee: SortOrderSchema.optional(),
  depositRequired: SortOrderSchema.optional(),
  depositPaid: SortOrderSchema.optional()
}).strict();
export const OrderAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.OrderAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.OrderAvgOrderByAggregateInput>;
export const OrderAvgOrderByAggregateInputObjectZodSchema = makeSchema();
