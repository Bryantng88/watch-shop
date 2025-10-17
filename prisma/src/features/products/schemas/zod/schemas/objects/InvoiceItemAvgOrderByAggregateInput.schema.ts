import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  quantity: SortOrderSchema.optional(),
  unitPrice: SortOrderSchema.optional(),
  discount: SortOrderSchema.optional(),
  taxRate: SortOrderSchema.optional(),
  lineTotal: SortOrderSchema.optional()
}).strict();
export const InvoiceItemAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceItemAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemAvgOrderByAggregateInput>;
export const InvoiceItemAvgOrderByAggregateInputObjectZodSchema = makeSchema();
