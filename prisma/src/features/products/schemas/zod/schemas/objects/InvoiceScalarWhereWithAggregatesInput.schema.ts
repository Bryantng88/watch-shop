import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumInvoiceTypeWithAggregatesFilterObjectSchema as EnumInvoiceTypeWithAggregatesFilterObjectSchema } from './EnumInvoiceTypeWithAggregatesFilter.schema';
import { InvoiceTypeSchema } from '../enums/InvoiceType.schema';
import { EnumInvoiceStatusWithAggregatesFilterObjectSchema as EnumInvoiceStatusWithAggregatesFilterObjectSchema } from './EnumInvoiceStatusWithAggregatesFilter.schema';
import { InvoiceStatusSchema } from '../enums/InvoiceStatus.schema';
import { DecimalWithAggregatesFilterObjectSchema as DecimalWithAggregatesFilterObjectSchema } from './DecimalWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const invoicescalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => InvoiceScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => InvoiceScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InvoiceScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InvoiceScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => InvoiceScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumInvoiceTypeWithAggregatesFilterObjectSchema), InvoiceTypeSchema]).optional(),
  status: z.union([z.lazy(() => EnumInvoiceStatusWithAggregatesFilterObjectSchema), InvoiceStatusSchema]).optional(),
  customerId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  acquisitionId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serviceRequestId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  subTotal: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  taxTotal: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  discountTotal: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  grandTotal: z.union([z.lazy(() => DecimalWithAggregatesFilterObjectSchema), z.number()]).optional(),
  issuedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  dueAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const InvoiceScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.InvoiceScalarWhereWithAggregatesInput> = invoicescalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.InvoiceScalarWhereWithAggregatesInput>;
export const InvoiceScalarWhereWithAggregatesInputObjectZodSchema = invoicescalarwherewithaggregatesinputSchema;
