import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema'

const nestedenumreservationstatusfilterSchema = z.object({
  equals: ReservationStatusSchema.optional(),
  in: ReservationStatusSchema.array().optional(),
  notIn: ReservationStatusSchema.array().optional(),
  not: z.union([ReservationStatusSchema, z.lazy(() => NestedEnumReservationStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumReservationStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumReservationStatusFilter> = nestedenumreservationstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumReservationStatusFilter>;
export const NestedEnumReservationStatusFilterObjectZodSchema = nestedenumreservationstatusfilterSchema;
