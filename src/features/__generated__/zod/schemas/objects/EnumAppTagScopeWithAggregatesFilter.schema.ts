import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AppTagScopeSchema } from '../enums/AppTagScope.schema';
import { NestedEnumAppTagScopeWithAggregatesFilterObjectSchema as NestedEnumAppTagScopeWithAggregatesFilterObjectSchema } from './NestedEnumAppTagScopeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumAppTagScopeFilterObjectSchema as NestedEnumAppTagScopeFilterObjectSchema } from './NestedEnumAppTagScopeFilter.schema'

const makeSchema = () => z.object({
  equals: AppTagScopeSchema.optional(),
  in: AppTagScopeSchema.array().optional(),
  notIn: AppTagScopeSchema.array().optional(),
  not: z.union([AppTagScopeSchema, z.lazy(() => NestedEnumAppTagScopeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumAppTagScopeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumAppTagScopeFilterObjectSchema).optional()
}).strict();
export const EnumAppTagScopeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumAppTagScopeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumAppTagScopeWithAggregatesFilter>;
export const EnumAppTagScopeWithAggregatesFilterObjectZodSchema = makeSchema();
