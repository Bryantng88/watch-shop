import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceArgsObjectSchema as InvoiceArgsObjectSchema } from './InvoiceArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  invoiceId: z.boolean().optional(),
  productId: z.boolean().optional(),
  variantId: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  quantity: z.boolean().optional(),
  unitPrice: z.boolean().optional(),
  discount: z.boolean().optional(),
  taxRate: z.boolean().optional(),
  lineTotal: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  invoice: z.union([z.boolean(), z.lazy(() => InvoiceArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const InvoiceItemSelectObjectSchema: z.ZodType<Prisma.InvoiceItemSelect> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemSelect>;
export const InvoiceItemSelectObjectZodSchema = makeSchema();
