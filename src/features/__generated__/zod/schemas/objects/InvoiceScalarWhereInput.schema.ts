import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumInvoiceTypeFilterObjectSchema as EnumInvoiceTypeFilterObjectSchema } from './EnumInvoiceTypeFilter.schema';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { EnumInvoiceStatusFilterObjectSchema as EnumInvoiceStatusFilterObjectSchema } from './EnumInvoiceStatusFilter.schema';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const invoicescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InvoiceScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InvoiceScalarWhereInputObjectSchema), z.lazy(() => InvoiceScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumInvoiceTypeFilterObjectSchema), InvoiceTypeSchema]).optional(),
  status: z.union([z.lazy(() => EnumInvoiceStatusFilterObjectSchema), InvoiceStatusSchema]).optional(),
  customerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  subTotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  taxTotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  discountTotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  grandTotal: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  issuedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  dueAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const InvoiceScalarWhereInputObjectSchema: z.ZodType<Prisma.InvoiceScalarWhereInput> = invoicescalarwhereinputSchema as unknown as z.ZodType<Prisma.InvoiceScalarWhereInput>;
export const InvoiceScalarWhereInputObjectZodSchema = invoicescalarwhereinputSchema;
