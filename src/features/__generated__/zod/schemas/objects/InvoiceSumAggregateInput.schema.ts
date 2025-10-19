import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  subTotal: z.literal(true).optional(),
  taxTotal: z.literal(true).optional(),
  discountTotal: z.literal(true).optional(),
  grandTotal: z.literal(true).optional()
}).strict();
export const InvoiceSumAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceSumAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceSumAggregateInputType>;
export const InvoiceSumAggregateInputObjectZodSchema = makeSchema();
