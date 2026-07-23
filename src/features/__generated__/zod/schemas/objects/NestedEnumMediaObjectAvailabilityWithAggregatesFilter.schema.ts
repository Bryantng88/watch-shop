import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumMediaObjectAvailabilityFilterObjectSchema as NestedEnumMediaObjectAvailabilityFilterObjectSchema } from './NestedEnumMediaObjectAvailabilityFilter.schema'

const nestedenummediaobjectavailabilitywithaggregatesfilterSchema = z.object({
  equals: MediaObjectAvailabilitySchema.optional(),
  in: MediaObjectAvailabilitySchema.array().optional(),
  notIn: MediaObjectAvailabilitySchema.array().optional(),
  not: z.union([MediaObjectAvailabilitySchema, z.lazy(() => NestedEnumMediaObjectAvailabilityWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumMediaObjectAvailabilityFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumMediaObjectAvailabilityFilterObjectSchema).optional()
}).strict();
export const NestedEnumMediaObjectAvailabilityWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaObjectAvailabilityWithAggregatesFilter> = nestedenummediaobjectavailabilitywithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaObjectAvailabilityWithAggregatesFilter>;
export const NestedEnumMediaObjectAvailabilityWithAggregatesFilterObjectZodSchema = nestedenummediaobjectavailabilitywithaggregatesfilterSchema;
