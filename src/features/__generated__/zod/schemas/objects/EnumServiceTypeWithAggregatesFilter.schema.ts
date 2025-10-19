import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ServiceTypeSchema } from '../enums/ServiceType.schema';
import { NestedEnumServiceTypeWithAggregatesFilterObjectSchema as NestedEnumServiceTypeWithAggregatesFilterObjectSchema } from './NestedEnumServiceTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumServiceTypeFilterObjectSchema as NestedEnumServiceTypeFilterObjectSchema } from './NestedEnumServiceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: ServiceTypeSchema.optional(),
  in: ServiceTypeSchema.array().optional(),
  notIn: ServiceTypeSchema.array().optional(),
  not: z.union([ServiceTypeSchema, z.lazy(() => NestedEnumServiceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumServiceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumServiceTypeFilterObjectSchema).optional()
}).strict();
export const EnumServiceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumServiceTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumServiceTypeWithAggregatesFilter>;
export const EnumServiceTypeWithAggregatesFilterObjectZodSchema = makeSchema();
