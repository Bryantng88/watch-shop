import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  depositAmt: SortOrderSchema.optional(),
  expiresAt: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const ReservationMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ReservationMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationMinOrderByAggregateInput>;
export const ReservationMinOrderByAggregateInputObjectZodSchema = makeSchema();
