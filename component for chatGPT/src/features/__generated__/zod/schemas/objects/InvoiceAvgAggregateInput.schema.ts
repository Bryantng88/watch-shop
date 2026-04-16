import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  subTotal: z.literal(true).optional(),
  taxTotal: z.literal(true).optional(),
  discountTotal: z.literal(true).optional(),
  grandTotal: z.literal(true).optional()
}).strict();
export const InvoiceAvgAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceAvgAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceAvgAggregateInputType>;
export const InvoiceAvgAggregateInputObjectZodSchema = makeSchema();
