import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumServiceTypeFilterObjectSchema as EnumServiceTypeFilterObjectSchema } from './EnumServiceTypeFilter.schema';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const maintenancerecordscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema), z.lazy(() => MaintenanceRecordScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumServiceTypeFilterObjectSchema), ServiceTypeSchema]).optional(),
  billable: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  serviceRequestId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  brandSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  modelSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serialSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  servicedByName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  servicedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  totalCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  billed: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  invoiceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  revenueAmount: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MaintenanceRecordScalarWhereInputObjectSchema: z.ZodType<Prisma.MaintenanceRecordScalarWhereInput> = maintenancerecordscalarwhereinputSchema as unknown as z.ZodType<Prisma.MaintenanceRecordScalarWhereInput>;
export const MaintenanceRecordScalarWhereInputObjectZodSchema = maintenancerecordscalarwhereinputSchema;
