import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { UuidWithAggregatesFilterObjectSchema as UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema'

const carrierstatushistoryscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierStatusHistoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierStatusHistoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierStatusHistoryScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierStatusHistoryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CarrierStatusHistoryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  carrierCode: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  externalStatus: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  normalizedStatus: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  location: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  occurredAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  payloadJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const CarrierStatusHistoryScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryScalarWhereWithAggregatesInput> = carrierstatushistoryscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CarrierStatusHistoryScalarWhereWithAggregatesInput>;
export const CarrierStatusHistoryScalarWhereWithAggregatesInputObjectZodSchema = carrierstatushistoryscalarwherewithaggregatesinputSchema;
