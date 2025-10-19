import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  invoiceId: SortOrderSchema.optional(),
  method: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  paidAt: SortOrderSchema.optional(),
  reference: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const PaymentMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PaymentMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentMaxOrderByAggregateInput>;
export const PaymentMaxOrderByAggregateInputObjectZodSchema = makeSchema();
