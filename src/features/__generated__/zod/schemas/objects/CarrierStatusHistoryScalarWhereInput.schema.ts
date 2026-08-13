import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema'

const carrierstatushistoryscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema), z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema), z.lazy(() => CarrierStatusHistoryScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  carrierCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  externalStatus: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  normalizedStatus: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  occurredAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  payloadJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CarrierStatusHistoryScalarWhereInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryScalarWhereInput> = carrierstatushistoryscalarwhereinputSchema as unknown as z.ZodType<Prisma.CarrierStatusHistoryScalarWhereInput>;
export const CarrierStatusHistoryScalarWhereInputObjectZodSchema = carrierstatushistoryscalarwhereinputSchema;
