import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceCreateNestedOneWithoutItemsInputObjectSchema as InvoiceCreateNestedOneWithoutItemsInputObjectSchema } from './InvoiceCreateNestedOneWithoutItemsInput.schema';
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
  invoice: z.lazy(() => InvoiceCreateNestedOneWithoutItemsInputObjectSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutInvoiceItemInputObjectSchema).optional(),
  variant: z.lazy(() => ProductVariantCreateNestedOneWithoutInvoiceItemInputObjectSchema).optional()
}).strict();
export const InvoiceItemCreateInputObjectSchema: z.ZodType<Prisma.InvoiceItemCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemCreateInput>;
export const InvoiceItemCreateInputObjectZodSchema = makeSchema();
