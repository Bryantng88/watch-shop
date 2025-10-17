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
export const InvoiceItemMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceItemMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemMinOrderByAggregateInput>;
export const InvoiceItemMinOrderByAggregateInputObjectZodSchema = makeSchema();
