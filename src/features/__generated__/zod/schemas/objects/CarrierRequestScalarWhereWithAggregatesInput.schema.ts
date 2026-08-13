import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { UuidWithAggregatesFilterObjectSchema as UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { JsonWithAggregatesFilterObjectSchema as JsonWithAggregatesFilterObjectSchema } from './JsonWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { EnumCarrierRequestStatusWithAggregatesFilterObjectSchema as EnumCarrierRequestStatusWithAggregatesFilterObjectSchema } from './EnumCarrierRequestStatusWithAggregatesFilter.schema';
import { CarrierRequestStatusSchema } from '../enums/CarrierRequestStatus.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

const carrierrequestscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierRequestScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierRequestScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierRequestScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  carrierCode: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  environment: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  operation: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  idempotencyKey: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  requestJson: z.lazy(() => JsonWithAggregatesFilterObjectSchema).optional(),
  responseJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  status: z.union([z.lazy(() => EnumCarrierRequestStatusWithAggregatesFilterObjectSchema), CarrierRequestStatusSchema]).optional(),
  httpStatus: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  externalOrderCode: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  errorCode: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  errorMessage: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  attemptCount: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  requestedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  completedAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable()
}).strict();
export const CarrierRequestScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CarrierRequestScalarWhereWithAggregatesInput> = carrierrequestscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CarrierRequestScalarWhereWithAggregatesInput>;
export const CarrierRequestScalarWhereWithAggregatesInputObjectZodSchema = carrierrequestscalarwherewithaggregatesinputSchema;
