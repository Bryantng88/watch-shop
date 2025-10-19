import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumReservationStatusFilterObjectSchema as EnumReservationStatusFilterObjectSchema } from './EnumReservationStatusFilter.schema';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { ProductNullableScalarRelationFilterObjectSchema as ProductNullableScalarRelationFilterObjectSchema } from './ProductNullableScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema'

const reservationwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ReservationWhereInputObjectSchema), z.lazy(() => ReservationWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ReservationWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ReservationWhereInputObjectSchema), z.lazy(() => ReservationWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  orderId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumReservationStatusFilterObjectSchema), ReservationStatusSchema]).optional(),
  depositAmt: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  expiresAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  product: z.union([z.lazy(() => ProductNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional()
}).strict();
export const ReservationWhereInputObjectSchema: z.ZodType<Prisma.ReservationWhereInput> = reservationwhereinputSchema as unknown as z.ZodType<Prisma.ReservationWhereInput>;
export const ReservationWhereInputObjectZodSchema = reservationwhereinputSchema;
