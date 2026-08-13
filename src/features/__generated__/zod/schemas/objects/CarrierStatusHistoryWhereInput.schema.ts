import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { ShipmentScalarRelationFilterObjectSchema as ShipmentScalarRelationFilterObjectSchema } from './ShipmentScalarRelationFilter.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './ShipmentWhereInput.schema'

const carrierstatushistorywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema), z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema), z.lazy(() => CarrierStatusHistoryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  carrierCode: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  externalStatus: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  normalizedStatus: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  location: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  occurredAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  payloadJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  shipment: z.union([z.lazy(() => ShipmentScalarRelationFilterObjectSchema), z.lazy(() => ShipmentWhereInputObjectSchema)]).optional()
}).strict();
export const CarrierStatusHistoryWhereInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryWhereInput> = carrierstatushistorywhereinputSchema as unknown as z.ZodType<Prisma.CarrierStatusHistoryWhereInput>;
export const CarrierStatusHistoryWhereInputObjectZodSchema = carrierstatushistorywhereinputSchema;
