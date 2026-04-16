import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumReservationStatusWithAggregatesFilterObjectSchema as EnumReservationStatusWithAggregatesFilterObjectSchema } from './EnumReservationStatusWithAggregatesFilter.schema';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const reservationscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ReservationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ReservationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ReservationScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ReservationScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ReservationScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumReservationStatusWithAggregatesFilterObjectSchema), ReservationStatusSchema]).optional(),
  depositAmt: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  expiresAt: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ReservationScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ReservationScalarWhereWithAggregatesInput> = reservationscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ReservationScalarWhereWithAggregatesInput>;
export const ReservationScalarWhereWithAggregatesInputObjectZodSchema = reservationscalarwherewithaggregatesinputSchema;
