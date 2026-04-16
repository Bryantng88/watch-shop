import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema'

const nestedenumavailabilitystatusfilterSchema = z.object({
  equals: AvailabilityStatusSchema.optional(),
  in: AvailabilityStatusSchema.array().optional(),
  notIn: AvailabilityStatusSchema.array().optional(),
  not: z.union([AvailabilityStatusSchema, z.lazy(() => NestedEnumAvailabilityStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumAvailabilityStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumAvailabilityStatusFilter> = nestedenumavailabilitystatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAvailabilityStatusFilter>;
export const NestedEnumAvailabilityStatusFilterObjectZodSchema = nestedenumavailabilitystatusfilterSchema;
