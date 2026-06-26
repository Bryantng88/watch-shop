import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAppTagScopeFilterObjectSchema as NestedEnumAppTagScopeFilterObjectSchema } from './NestedEnumAppTagScopeFilter.schema'

const nestedenumapptagscopewithaggregatesfilterSchema = z.object({
  equals: AppTagScopeSchema.optional(),
  in: AppTagScopeSchema.array().optional(),
  notIn: AppTagScopeSchema.array().optional(),
  not: z.union([AppTagScopeSchema, z.lazy(() => NestedEnumAppTagScopeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAppTagScopeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAppTagScopeFilterObjectSchema).optional()
}).strict();
export const NestedEnumAppTagScopeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumAppTagScopeWithAggregatesFilter> = nestedenumapptagscopewithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumAppTagScopeWithAggregatesFilter>;
export const NestedEnumAppTagScopeWithAggregatesFilterObjectZodSchema = nestedenumapptagscopewithaggregatesfilterSchema;
