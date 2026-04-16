import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema as ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema } from './ProductCreateNestedOneWithoutInvoiceItemInput.schema';
import { ProductVariantCreateNestedOneWithoutInvoiceItemInputObjectSchema as ProductVariantCreateNestedOneWithoutInvoiceItemInputObjectSchema } from './ProductVariantCreateNestedOneWithoutInvoiceItemInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  quantity: z.number().optional(),
  unitPrice: z.number(),
  discount: z.number().optional(),
  taxRate: z.number().optional(),
  lineTotal: z.number(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutInvoiceItemInputObjectSchema).optional()
}).strict();
export const InvoiceItemCreateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateWithoutInvoiceInput>;
export const InvoiceItemCreateWithoutInvoiceInputObjectZodSchema = makeSchema();
