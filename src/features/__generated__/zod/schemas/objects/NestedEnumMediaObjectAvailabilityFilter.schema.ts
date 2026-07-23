import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectAvailabilitySchema } from '../enums/MediaObjectAvailability.schema'

const nestedenummediaobjectavailabilityfilterSchema = z.object({
  equals: MediaObjectAvailabilitySchema.optional(),
  in: MediaObjectAvailabilitySchema.array().optional(),
  notIn: MediaObjectAvailabilitySchema.array().optional(),
  not: z.union([MediaObjectAvailabilitySchema, z.lazy(() => NestedEnumMediaObjectAvailabilityFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumMediaObjectAvailabilityFilterObjectSchema: z.ZodType<Prisma.NestedEnumMediaObjectAvailabilityFilter> = nestedenummediaobjectavailabilityfilterSchema as unknown as z.ZodType<Prisma.NestedEnumMediaObjectAvailabilityFilter>;
export const NestedEnumMediaObjectAvailabilityFilterObjectZodSchema = nestedenummediaobjectavailabilityfilterSchema;
