import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const invoiceitemscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => InvoiceItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InvoiceItemScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InvoiceItemScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  invoiceId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  quantity: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  unitPrice: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  discount: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  taxRate: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  lineTotal: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const InvoiceItemScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.InvoiceItemScalarWhereWithAggregatesInput> = invoiceitemscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.InvoiceItemScalarWhereWithAggregatesInput>;
export const InvoiceItemScalarWhereWithAggregatesInputObjectZodSchema = invoiceitemscalarwherewithaggregatesinputSchema;
