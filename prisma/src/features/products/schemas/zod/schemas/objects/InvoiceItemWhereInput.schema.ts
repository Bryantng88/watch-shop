import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { InvoiceScalarRelationFilterObjectSchema as InvoiceScalarRelationFilterObjectSchema } from './InvoiceScalarRelationFilter.schema';
import { InvoiceWhereInputObjectSchema as InvoiceWhereInputObjectSchema } from './InvoiceWhereInput.schema';
import { ProductNullableScalarRelationFilterObjectSchema as ProductNullableScalarRelationFilterObjectSchema } from './ProductNullableScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { ProductVariantNullableScalarRelationFilterObjectSchema as ProductVariantNullableScalarRelationFilterObjectSchema } from './ProductVariantNullableScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const invoiceitemwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => InvoiceItemWhereInputObjectSchema), z.lazy(() => InvoiceItemWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InvoiceItemWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InvoiceItemWhereInputObjectSchema), z.lazy(() => InvoiceItemWhereInputObjectSchema).array()]).optional(),
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
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  invoice: z.union([z.lazy(() => InvoiceScalarRelationFilterObjectSchema), z.lazy(() => InvoiceWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  variant: z.union([z.lazy(() => ProductVariantNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const InvoiceItemWhereInputObjectSchema: z.ZodType<Prisma.InvoiceItemWhereInput> = invoiceitemwhereinputSchema as unknown as z.ZodType<Prisma.InvoiceItemWhereInput>;
export const InvoiceItemWhereInputObjectZodSchema = invoiceitemwhereinputSchema;
