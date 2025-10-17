import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  invoiceId: SortOrderSchema.optional(),
  productId: SortOrderSchema.optional(),
  variantId: SortOrderSchema.optional(),
  title: SortOrderSchema.optional(),
  description: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  unitPrice: SortOrderSchema.optional(),
  discount: SortOrderSchema.optional(),
  taxRate: SortOrderSchema.optional(),
  lineTotal: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional()
}).strict();
export const InvoiceItemCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceItemCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCountOrderByAggregateInput>;
export const InvoiceItemCountOrderByAggregateInputObjectZodSchema = makeSchema();
