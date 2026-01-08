import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumshipmentstatusFilterObjectSchema as EnumshipmentstatusFilterObjectSchema } from './EnumshipmentstatusFilter.schema';
import { shipmentstatusSchema } from '../enums/shipmentstatus.schema';
import { OrderScalarRelationFilterObjectSchema as OrderScalarRelationFilterObjectSchema } from './OrderScalarRelationFilter.schema';
import { OrderWhereInputObjectSchema as OrderWhereInputObjectSchema } from './OrderWhereInput.schema'

const shipmentwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ShipmentWhereInputObjectSchema), z.lazy(() => ShipmentWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ShipmentWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ShipmentWhereInputObjectSchema), z.lazy(() => ShipmentWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  orderId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipPhone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipAddress: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipCity: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipDistrict: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shipWard: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  carrier: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  trackingCode: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  shippingFee: z.union([z.lazy(() => DecimalFilterObjectSchema), z.number()]).optional(),
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string().max(10)]).optional(),
  shippedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  deliveredAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  status: z.union([z.lazy(() => EnumshipmentstatusFilterObjectSchema), shipmentstatusSchema]).optional(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  Order: z.union([z.lazy(() => OrderScalarRelationFilterObjectSchema), z.lazy(() => OrderWhereInputObjectSchema)]).optional()
}).strict();
export const ShipmentWhereInputObjectSchema: z.ZodType<Prisma.ShipmentWhereInput> = shipmentwhereinputSchema as unknown as z.ZodType<Prisma.ShipmentWhereInput>;
export const ShipmentWhereInputObjectZodSchema = shipmentwhereinputSchema;
