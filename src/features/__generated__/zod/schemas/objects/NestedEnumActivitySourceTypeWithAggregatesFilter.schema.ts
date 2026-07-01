import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumActivitySourceTypeFilterObjectSchema as NestedEnumActivitySourceTypeFilterObjectSchema } from './NestedEnumActivitySourceTypeFilter.schema'

const nestedenumactivitysourcetypewithaggregatesfilterSchema = z.object({
  equals: ActivitySourceTypeSchema.optional(),
  in: ActivitySourceTypeSchema.array().optional(),
  notIn: ActivitySourceTypeSchema.array().optional(),
  not: z.union([ActivitySourceTypeSchema, z.lazy(() => NestedEnumActivitySourceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumActivitySourceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumActivitySourceTypeFilterObjectSchema).optional()
}).strict();
export const NestedEnumActivitySourceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumActivitySourceTypeWithAggregatesFilter> = nestedenumactivitysourcetypewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumActivitySourceTypeWithAggregatesFilter>;
export const NestedEnumActivitySourceTypeWithAggregatesFilterObjectZodSchema = nestedenumactivitysourcetypewithaggregatesfilterSchema;
