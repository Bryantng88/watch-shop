import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AvailabilityStatusSchema } from '../enums/AvailabilityStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAvailabilityStatusFilterObjectSchema as NestedEnumAvailabilityStatusFilterObjectSchema } from './NestedEnumAvailabilityStatusFilter.schema'

const nestedenumavailabilitystatuswithaggregatesfilterSchema = z.object({
  equals: AvailabilityStatusSchema.optional(),
  in: AvailabilityStatusSchema.array().optional(),
  notIn: AvailabilityStatusSchema.array().optional(),
  not: z.union([AvailabilityStatusSchema, z.lazy(() => NestedEnumAvailabilityStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAvailabilityStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAvailabilityStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumAvailabilityStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAvailabilityStatusWithAggregatesFilter> = nestedenumavailabilitystatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAvailabilityStatusWithAggregatesFilter>;
export const NestedEnumAvailabilityStatusWithAggregatesFilterObjectZodSchema = nestedenumavailabilitystatuswithaggregatesfilterSchema;
