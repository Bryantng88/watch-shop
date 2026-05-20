import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalFilterObjectSchema as DecimalFilterObjectSchema } from './DecimalFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { EnumShipmentStatusFilterObjectSchema as EnumShipmentStatusFilterObjectSchema } from './EnumShipmentStatusFilter.schema';
import { ShipmentStatusSchema } from '../enums/ShipmentStatus.schema';
import { EnumShippingFeePayerNullableFilterObjectSchema as EnumShippingFeePayerNullableFilterObjectSchema } from './EnumShippingFeePayerNullableFilter.schema';
import { ShippingFeePayerSchema } from '../enums/ShippingFeePayer.schema'

const shipmentscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ShipmentScalarWhereInputObjectSchema), z.lazy(() => ShipmentScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ShipmentScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ShipmentScalarWhereInputObjectSchema), z.lazy(() => ShipmentScalarWhereInputObjectSchema).array()]).optional(),
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
  currency: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shippedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  deliveredAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  status: z.union([z.lazy(() => EnumShipmentStatusFilterObjectSchema), ShipmentStatusSchema]).optional(),
  shippingFeePayer: z.union([z.lazy(() => EnumShippingFeePayerNullableFilterObjectSchema), ShippingFeePayerSchema]).optional().nullable(),
  refNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderRefNo: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  customerName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const ShipmentScalarWhereInputObjectSchema: z.ZodType<Prisma.ShipmentScalarWhereInput> = shipmentscalarwhereinputSchema as unknown as z.ZodType<Prisma.ShipmentScalarWhereInput>;
export const ShipmentScalarWhereInputObjectZodSchema = shipmentscalarwhereinputSchema;
