import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateNestedOneWithoutItemsInputObjectSchema as InvoiceCreateNestedOneWithoutItemsInputObjectSchema } from './InvoiceCreateNestedOneWithoutItemsInput.schema';
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
  invoice: z.lazy(() => InvoiceCreateNestedOneWithoutItemsInputObjectSchema),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutInvoiceItemInputObjectSchema).optional()
}).strict();
export const InvoiceItemCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateWithoutProductInput>;
export const InvoiceItemCreateWithoutProductInputObjectZodSchema = makeSchema();
