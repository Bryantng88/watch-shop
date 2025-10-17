import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumReservationStatusFilterObjectSchema as EnumReservationStatusFilterObjectSchema } from './EnumReservationStatusFilter.schema';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const reservationscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ReservationScalarWhereInputObjectSchema), z.lazy(() => ReservationScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ReservationScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ReservationScalarWhereInputObjectSchema), z.lazy(() => ReservationScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumReservationStatusFilterObjectSchema), ReservationStatusSchema]).optional(),
  depositAmt: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  expiresAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ReservationScalarWhereInputObjectSchema: z.ZodType<Prisma.ReservationScalarWhereInput> = reservationscalarwhereinputSchema as unknown as z.ZodType<Prisma.ReservationScalarWhereInput>;
export const ReservationScalarWhereInputObjectZodSchema = reservationscalarwhereinputSchema;
