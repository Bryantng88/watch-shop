import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { InvoiceArgsObjectSchema as InvoiceArgsObjectSchema } from './InvoiceArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ProductVariantArgsObjectSchema as ProductVariantArgsObjectSchema } from './ProductVariantArgs.schema'

const makeSchema = () => z.object({
  invoice: z.union([z.boolean(), z.lazy(() => InvoiceArgsObjectSchema)]).optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  variant: z.union([z.boolean(), z.lazy(() => ProductVariantArgsObjectSchema)]).optional()
}).strict();
export const InvoiceItemIncludeObjectSchema: z.ZodType<Prisma.InvoiceItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceItemInclude>;
export const InvoiceItemIncludeObjectZodSchema = makeSchema();
