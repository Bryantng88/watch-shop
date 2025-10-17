import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  quantity: z.literal(true).optional(),
  unitPrice: z.literal(true).optional(),
  discount: z.literal(true).optional(),
  taxRate: z.literal(true).optional(),
  lineTotal: z.literal(true).optional()
}).strict();
export const InvoiceItemSumAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceItemSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemSumAggregateInputType>;
export const InvoiceItemSumAggregateInputObjectZodSchema = makeSchema();
