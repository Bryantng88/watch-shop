import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumServiceTypeFilterObjectSchema as EnumServiceTypeFilterObjectSchema } from './EnumServiceTypeFilter.schema';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { EnumServiceRequestStatusFilterObjectSchema as EnumServiceRequestStatusFilterObjectSchema } from './EnumServiceRequestStatusFilter.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumServiceScopeNullableFilterObjectSchema as EnumServiceScopeNullableFilterObjectSchema } from './EnumServiceScopeNullableFilter.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema'

const servicerequestscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ServiceRequestScalarWhereInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumServiceTypeFilterObjectSchema), ServiceTypeSchema]).optional(),
  billable: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  orderItemId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customerId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  brandSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  modelSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  serialSnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  appointmentAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumServiceRequestStatusFilterObjectSchema), ServiceRequestStatusSchema]).optional(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  warrantyUntil: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  warrantyPolicy: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  servicecatalogid: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumServiceScopeNullableFilterObjectSchema), ServiceScopeSchema]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  vendorNameSnap: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const ServiceRequestScalarWhereInputObjectSchema: z.ZodType<Prisma.ServiceRequestScalarWhereInput> = servicerequestscalarwhereinputSchema as unknown as z.ZodType<Prisma.ServiceRequestScalarWhereInput>;
export const ServiceRequestScalarWhereInputObjectZodSchema = servicerequestscalarwhereinputSchema;
