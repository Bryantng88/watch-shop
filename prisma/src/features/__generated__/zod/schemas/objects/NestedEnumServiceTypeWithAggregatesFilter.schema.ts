import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumServiceTypeFilterObjectSchema as NestedEnumServiceTypeFilterObjectSchema } from './NestedEnumServiceTypeFilter.schema'

const nestedenumservicetypewithaggregatesfilterSchema = z.object({
  equals: ServiceTypeSchema.optional(),
  in: ServiceTypeSchema.array().optional(),
  notIn: ServiceTypeSchema.array().optional(),
  not: z.union([ServiceTypeSchema, z.lazy(() => NestedEnumServiceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumServiceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumServiceTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumServiceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumServiceTypeWithAggregatesFilter> = nestedenumservicetypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumServiceTypeWithAggregatesFilter>;
export const NestedEnumServiceTypeWithAggregatesFilterObjectZodSchema = nestedenumservicetypewithaggregatesfilterSchema;
