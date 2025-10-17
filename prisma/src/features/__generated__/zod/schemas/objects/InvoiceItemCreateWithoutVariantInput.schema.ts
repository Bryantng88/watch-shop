import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateNestedOneWithoutItemsInputObjectSchema as InvoiceCreateNestedOneWithoutItemsInputObjectSchema } from './InvoiceCreateNestedOneWithoutItemsInput.schema';
import { ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema as ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema } from './ProductCreateNestedOneWithoutInvoiceItemInput.schema'

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
  product: z.lazy(() => ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema).optional()
}).strict();
export const InvoiceItemCreateWithoutVariantInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateWithoutVariantInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateWithoutVariantInput>;
export const InvoiceItemCreateWithoutVariantInputObjectZodSchema = makeSchema();
