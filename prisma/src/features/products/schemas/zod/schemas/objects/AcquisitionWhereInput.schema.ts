import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumAcquisitionTypeFilterObjectSchema as EnumAcquisitionTypeFilterObjectSchema } from './EnumAcquisitionTypeFilter.schema';
import { AcquisitionTypeSchema } from '../enums/AcquisitionType.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { CustomerNullableScalarRelationFilterObjectSchema as CustomerNullableScalarRelationFilterObjectSchema } from './CustomerNullableScalarRelationFilter.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './CustomerWhereInput.schema';
import { VendorNullableScalarRelationFilterObjectSchema as VendorNullableScalarRelationFilterObjectSchema } from './VendorNullableScalarRelationFilter.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './VendorWhereInput.schema';
import { AcquisitionItemListRelationFilterObjectSchema as AcquisitionItemListRelationFilterObjectSchema } from './AcquisitionItemListRelationFilter.schema';
import { InvoiceListRelationFilterObjectSchema as InvoiceListRelationFilterObjectSchema } from './InvoiceListRelationFilter.schema'

const acquisitionwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionWhereInputObjectSchema), z.lazy(() => AcquisitionWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionWhereInputObjectSchema), z.lazy(() => AcquisitionWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  type: z.union([z.lazy(() => EnumAcquisitionTypeFilterObjectSchema), AcquisitionTypeSchema]).optional(),
  acquiredAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  cost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  payoutStatus: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  condition: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  warrantyUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  customer: z.union([z.lazy(() => CustomerNullableScalarRelationFilterObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema)]).optional(),
  vendor: z.union([z.lazy(() => VendorNullableScalarRelationFilterObjectSchema), z.lazy(() => VendorWhereInputObjectSchema)]).optional(),
  AcquisitionItem: z.lazy(() => AcquisitionItemListRelationFilterObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceListRelationFilterObjectSchema).optional()
}).strict();
export const AcquisitionWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionWhereInput> = acquisitionwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionWhereInput>;
export const AcquisitionWhereInputObjectZodSchema = acquisitionwhereinputSchema;
