import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema'

const nestedenumservicetypefilterSchema = z.object({
  equals: ServiceTypeSchema.optional(),
  in: ServiceTypeSchema.array().optional(),
  notIn: ServiceTypeSchema.array().optional(),
  not: z.union([ServiceTypeSchema, z.lazy(() => NestedEnumServiceTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumServiceTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumServiceTypeFilter> = nestedenumservicetypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumServiceTypeFilter>;
export const NestedEnumServiceTypeFilterObjectZodSchema = nestedenumservicetypefilterSchema;
