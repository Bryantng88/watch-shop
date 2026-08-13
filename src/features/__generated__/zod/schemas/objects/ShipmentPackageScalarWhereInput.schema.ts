import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const shipmentpackagescalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema), z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema), z.lazy(() => ShipmentPackageScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  shipmentId: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  weightGram: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  lengthCm: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  widthCm: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  heightCm: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  itemCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  declaredValue: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  contentDescription: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ShipmentPackageScalarWhereInputObjectSchema: z.ZodType<Prisma.ShipmentPackageScalarWhereInput> = shipmentpackagescalarwhereinputSchema as unknown as z.ZodType<Prisma.ShipmentPackageScalarWhereInput>;
export const ShipmentPackageScalarWhereInputObjectZodSchema = shipmentpackagescalarwhereinputSchema;
