import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  customerId: SortOrderSchema.optional(),
  vendorId: SortOrderSchema.optional(),
  orderId: SortOrderSchema.optional(),
  acquisitionId: SortOrderSchema.optional(),
  serviceRequestId: SortOrderSchema.optional(),
  currency: SortOrderSchema.optional(),
  subTotal: SortOrderSchema.optional(),
  taxTotal: SortOrderSchema.optional(),
  discountTotal: SortOrderSchema.optional(),
  grandTotal: SortOrderSchema.optional(),
  issuedAt: SortOrderSchema.optional(),
  dueAt: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const InvoiceCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceCountOrderByAggregateInput>;
export const InvoiceCountOrderByAggregateInputObjectZodSchema = makeSchema();
