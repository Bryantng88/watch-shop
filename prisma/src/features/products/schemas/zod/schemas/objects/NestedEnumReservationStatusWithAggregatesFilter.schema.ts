import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ReservationStatusSchema } from '../enums/ReservationStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumReservationStatusFilterObjectSchema as NestedEnumReservationStatusFilterObjectSchema } from './NestedEnumReservationStatusFilter.schema'

const nestedenumreservationstatuswithaggregatesfilterSchema = z.object({
  equals: ReservationStatusSchema.optional(),
  in: ReservationStatusSchema.array().optional(),
  notIn: ReservationStatusSchema.array().optional(),
  not: z.union([ReservationStatusSchema, z.lazy(() => NestedEnumReservationStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumReservationStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumReservationStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumReservationStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumReservationStatusWithAggregatesFilter> = nestedenumreservationstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumReservationStatusWithAggregatesFilter>;
export const NestedEnumReservationStatusWithAggregatesFilterObjectZodSchema = nestedenumreservationstatuswithaggregatesfilterSchema;
