import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  invoiceId: z.string(),
  productId: z.string().optional().nullable(),
  title: z.string(),
  description: z.string().optional().nullable(),
  quantity: z.number().optional(),
  unitPrice: z.number(),
  discount: z.number().optional(),
  taxRate: z.number().optional(),
  lineTotal: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const InvoiceItemCreateManyVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateManyVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateManyVariantInput>;
export const InvoiceItemCreateManyVariantInputObjectZodSchema = makeSchema();
