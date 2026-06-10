import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { NestedEnumWorkCaseScopeWithAggregatesFilterObjectSchema as NestedEnumWorkCaseScopeWithAggregatesFilterObjectSchema } from './NestedEnumWorkCaseScopeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWorkCaseScopeFilterObjectSchema as NestedEnumWorkCaseScopeFilterObjectSchema } from './NestedEnumWorkCaseScopeFilter.schema'

const makeSchema = () => z.object({
  equals: WorkCaseScopeSchema.optional(),
  in: WorkCaseScopeSchema.array().optional(),
  notIn: WorkCaseScopeSchema.array().optional(),
  not: z.union([WorkCaseScopeSchema, z.lazy(() => NestedEnumWorkCaseScopeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWorkCaseScopeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWorkCaseScopeFilterObjectSchema).optional()
}).strict();
export const EnumWorkCaseScopeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWorkCaseScopeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWorkCaseScopeWithAggregatesFilter>;
export const EnumWorkCaseScopeWithAggregatesFilterObjectZodSchema = makeSchema();
