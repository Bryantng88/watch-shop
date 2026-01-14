import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  method: SortOrderSchema.optional(),
  amount: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  paidAt: SortOrderSchema.optional(),
  reference: SortOrderSchema.optional(),
  note: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  direction: SortOrderSchema.optional(),
  order_id: SortOrderSchema.optional(),
  service_request_id: SortOrderSchema.optional(),
  vendor_id: SortOrderSchema.optional(),
  acquisition_id: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  purpose: SortOrderSchema.optional(),
  shipment_id: SortOrderSchema.optional(),
  type: SortOrderSchema.optional()
}).strict();
export const PaymentMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PaymentMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PaymentMinOrderByAggregateInput>;
export const PaymentMinOrderByAggregateInputObjectZodSchema = makeSchema();
