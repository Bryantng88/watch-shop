import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  invoiceId: z.literal(true).optional(),
  productId: z.literal(true).optional(),
  variantId: z.literal(true).optional(),
  title: z.literal(true).optional(),
  description: z.literal(true).optional(),
  quantity: z.literal(true).optional(),
  unitPrice: z.literal(true).optional(),
  discount: z.literal(true).optional(),
  taxRate: z.literal(true).optional(),
  lineTotal: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const InvoiceItemMinAggregateInputObjectSchema: z.ZodType<Prisma.InvoiceItemMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemMinAggregateInputType>;
export const InvoiceItemMinAggregateInputObjectZodSchema = makeSchema();
