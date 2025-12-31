import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AcquisitionListRelationFilterObjectSchema as AcquisitionListRelationFilterObjectSchema } from './AcquisitionListRelationFilter.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema';
import { InvoiceListRelationFilterObjectSchema as InvoiceListRelationFilterObjectSchema } from './InvoiceListRelationFilter.schema';
import { OrderListRelationFilterObjectSchema as OrderListRelationFilterObjectSchema } from './OrderListRelationFilter.schema';
import { ServiceRequestListRelationFilterObjectSchema as ServiceRequestListRelationFilterObjectSchema } from './ServiceRequestListRelationFilter.schema'

const customerwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CustomerWhereInputObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CustomerWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CustomerWhereInputObjectSchema), z.lazy(() => CustomerWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string().max(32)]).optional().nullable(),
  ward: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  city: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  userId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
<<<<<<< HEAD
=======
  district: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
>>>>>>> 4f6d70506e71757ff795315d849e6d5ac7fcf052
  Acquisition: z.lazy(() => AcquisitionListRelationFilterObjectSchema).optional(),
  user: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional(),
  Invoice: z.lazy(() => InvoiceListRelationFilterObjectSchema).optional(),
  orders: z.lazy(() => OrderListRelationFilterObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestListRelationFilterObjectSchema).optional()
}).strict();
export const CustomerWhereInputObjectSchema: z.ZodType<Prisma.CustomerWhereInput> = customerwhereinputSchema as unknown as z.ZodType<Prisma.CustomerWhereInput>;
export const CustomerWhereInputObjectZodSchema = customerwhereinputSchema;
