import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumServiceTypeWithAggregatesFilterObjectSchema as EnumServiceTypeWithAggregatesFilterObjectSchema } from './EnumServiceTypeWithAggregatesFilter.schema';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { EnumServiceRequestStatusWithAggregatesFilterObjectSchema as EnumServiceRequestStatusWithAggregatesFilterObjectSchema } from './EnumServiceRequestStatusWithAggregatesFilter.schema';
import { ServiceRequestStatusSchema } from '../enums/ServiceRequestStatus.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumServiceScopeNullableWithAggregatesFilterObjectSchema as EnumServiceScopeNullableWithAggregatesFilterObjectSchema } from './EnumServiceScopeNullableWithAggregatesFilter.schema';
import { ServiceScopeSchema } from '../enums/ServiceScope.schema'

const servicerequestscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ServiceRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ServiceRequestScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ServiceRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ServiceRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  type: z.union([z.lazy(() => EnumServiceTypeWithAggregatesFilterObjectSchema), ServiceTypeSchema]).optional(),
  billable: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  orderItemId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  customerId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  variantId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  brandSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  modelSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  refSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  serialSnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  appointmentAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumServiceRequestStatusWithAggregatesFilterObjectSchema), ServiceRequestStatusSchema]).optional(),
  notes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  warrantyUntil: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  warrantyPolicy: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  servicecatalogid: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  refNo: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumServiceScopeNullableWithAggregatesFilterObjectSchema), ServiceScopeSchema]).optional().nullable(),
  vendorId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  vendorNameSnap: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const ServiceRequestScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ServiceRequestScalarWhereWithAggregatesInput> = servicerequestscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ServiceRequestScalarWhereWithAggregatesInput>;
export const ServiceRequestScalarWhereWithAggregatesInputObjectZodSchema = servicerequestscalarwherewithaggregatesinputSchema;
