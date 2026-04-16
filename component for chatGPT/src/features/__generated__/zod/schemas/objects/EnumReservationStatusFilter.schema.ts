import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema';
import { NestedEnumReservationStatusFilterObjectSchema as NestedEnumReservationStatusFilterObjectSchema } from './NestedEnumReservationStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ReservationStatusSchema.optional(),
  in: ReservationStatusSchema.array().optional(),
  notIn: ReservationStatusSchema.array().optional(),
  not: z.union([ReservationStatusSchema, z.lazy(() => NestedEnumReservationStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumReservationStatusFilterObjectSchema: z.ZodType<Prisma.EnumReservationStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumReservationStatusFilter>;
export const EnumReservationStatusFilterObjectZodSchema = makeSchema();
