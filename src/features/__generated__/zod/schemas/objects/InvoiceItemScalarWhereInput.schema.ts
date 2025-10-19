import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const invoiceitemscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => InvoiceItemScalarWhereInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InvoiceItemScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InvoiceItemScalarWhereInputObjectSchema), z.lazy(() => InvoiceItemScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  invoiceId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  quantity: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  unitPrice: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  discount: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  taxRate: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  lineTotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const InvoiceItemScalarWhereInputObjectSchema: z.ZodType<Prisma.InvoiceItemScalarWhereInput> = invoiceitemscalarwhereinputSchema as unknown as z.ZodType<Prisma.InvoiceItemScalarWhereInput>;
export const InvoiceItemScalarWhereInputObjectZodSchema = invoiceitemscalarwhereinputSchema;
