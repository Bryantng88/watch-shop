import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema';
import { NestedEnumMediaObjectAvailabilityFilterObjectSchema as NestedEnumMediaObjectAvailabilityFilterObjectSchema } from './NestedEnumMediaObjectAvailabilityFilter.schema'

const makeSchema = () => z.object({
  equals: MediaObjectAvailabilitySchema.optional(),
  in: MediaObjectAvailabilitySchema.array().optional(),
  notIn: MediaObjectAvailabilitySchema.array().optional(),
  not: z.union([MediaObjectAvailabilitySchema, z.lazy(() => NestedEnumMediaObjectAvailabilityFilterObjectSchema)]).optional()
}).strict();
export const EnumMediaObjectAvailabilityFilterObjectSchema: z.ZodType<Prisma.EnumMediaObjectAvailabilityFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumMediaObjectAvailabilityFilter>;
export const EnumMediaObjectAvailabilityFilterObjectZodSchema = makeSchema();
