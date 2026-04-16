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
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AcquisitionNullableScalarRelationFilterObjectSchema as AcquisitionNullableScalarRelationFilterObjectSchema } from './AcquisitionNullableScalarRelationFilter.schema';
import { AcquisitionWhereInputObjectSchema as AcquisitionWhereInputObjectSchema } from './AcquisitionWhereInput.schema';
import { CustomerNullableScalarRelationFilterObjectSchema as CustomerNullableScalarRelationFilterObjectSchema } from './CustomerNullableScalarRelationFilter.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { OrderNullableScalarRelationFilterObjectSchema as OrderNullableScalarRelationFilterObjectSchema } from './OrderNullableScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema';
import { ServiceRequestNullableScalarRelationFilterObjectSchema as ServiceRequestNullableScalarRelationFilterObjectSchema } from './ServiceRequestNullableScalarRelationFilter.schema';
import { ServiceRequestWhereInputObjectSchema as ServiceRequestWhereInputObjectSchema } from './ServiceRequestWhereInput.schema';
import { VendorNullableScalarRelationFilterObjectSchema as VendorNullableScalarRelationFilterObjectSchema } from './VendorNullableScalarRelationFilter.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { InvoiceItemListRelationFilterObjectSchema as InvoiceItemListRelationFilterObjectSchema } from './InvoiceItemListRelationFilter.schema'

const invoicewhereinputSchema = z.object({
  AND: z.union([z.lazy(() => InvoiceWhereInputObjectSchema), z.lazy(() => InvoiceWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => InvoiceWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => InvoiceWhereInputObjectSchema), z.lazy(() => InvoiceWhereInputObjectSchema).array()]).optional(),
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
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  acquisition: z.union([z.lazy(() => AcquisitionNullableScalarRelationFilterObjectSchema), z.lazy(() => AcquisitionWhereInputObjectSchema)]).optional(),
  customer: z.union([z.lazy(() => CustomerNullableScalarRelationFilterObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  order: z.union([z.lazy(() => OrderNullableScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional(),
  serviceReq: z.union([z.lazy(() => ServiceRequestNullableScalarRelationFilterObjectSchema), z.lazy(() => ServiceRequestWhereInputObjectSchema)]).optional(),
  vendor: z.union([z.lazy(() => VendorNullableScalarRelationFilterObjectSchema), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  items: z.lazy(() => InvoiceItemListRelationFilterObjectSchema).optional()
}).strict();
export const InvoiceWhereInputObjectSchema: z.ZodType<Prisma.InvoiceWhereInput> = invoicewhereinputSchema as unknown as z.ZodType<Prisma.InvoiceWhereInput>;
export const InvoiceWhereInputObjectZodSchema = invoicewhereinputSchema;
