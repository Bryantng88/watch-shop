import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { EnumCarrierRequestStatusFilterObjectSchema as EnumCarrierRequestStatusFilterObjectSchema } from './EnumCarrierRequestStatusFilter.schema';
import { CarrierRequestStatusSchema } from '../enums/CarrierRequestStatus.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const carrierrequestscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierRequestScalarWhereInputObjectSchema), z.lazy(() => CarrierRequestScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierRequestScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierRequestScalarWhereInputObjectSchema), z.lazy(() => CarrierRequestScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  carrierCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  environment: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  operation: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  idempotencyKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  requestJson: z.lazy(() => JsonFilterObjectSchema).optional(),
  responseJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  status: z.union([z.lazy(() => EnumCarrierRequestStatusFilterObjectSchema), CarrierRequestStatusSchema]).optional(),
  httpStatus: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  externalOrderCode: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  errorCode: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  errorMessage: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  attemptCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  requestedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  completedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable()
}).strict();
export const CarrierRequestScalarWhereInputObjectSchema: z.ZodType<Prisma.CarrierRequestScalarWhereInput> = carrierrequestscalarwhereinputSchema as unknown as z.ZodType<Prisma.CarrierRequestScalarWhereInput>;
export const CarrierRequestScalarWhereInputObjectZodSchema = carrierrequestscalarwhereinputSchema;
