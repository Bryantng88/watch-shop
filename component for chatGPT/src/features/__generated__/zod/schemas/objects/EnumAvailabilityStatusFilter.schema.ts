import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema';
import { NestedEnumAvailabilityStatusFilterObjectSchema as NestedEnumAvailabilityStatusFilterObjectSchema } from './NestedEnumAvailabilityStatusFilter.schema'

const makeSchema = () => z.object({
  equals: AvailabilityStatusSchema.optional(),
  in: AvailabilityStatusSchema.array().optional(),
  notIn: AvailabilityStatusSchema.array().optional(),
  not: z.union([AvailabilityStatusSchema, z.lazy(() => NestedEnumAvailabilityStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumAvailabilityStatusFilterObjectSchema: z.ZodType<Prisma.EnumAvailabilityStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAvailabilityStatusFilter>;
export const EnumAvailabilityStatusFilterObjectZodSchema = makeSchema();
