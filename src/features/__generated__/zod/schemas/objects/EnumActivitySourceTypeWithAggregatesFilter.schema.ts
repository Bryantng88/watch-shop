import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { NestedEnumActivitySourceTypeWithAggregatesFilterObjectSchema as NestedEnumActivitySourceTypeWithAggregatesFilterObjectSchema } from './NestedEnumActivitySourceTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumActivitySourceTypeFilterObjectSchema as NestedEnumActivitySourceTypeFilterObjectSchema } from './NestedEnumActivitySourceTypeFilter.schema'

const makeSchema = () => z.object({
  equals: ActivitySourceTypeSchema.optional(),
  in: ActivitySourceTypeSchema.array().optional(),
  notIn: ActivitySourceTypeSchema.array().optional(),
  not: z.union([ActivitySourceTypeSchema, z.lazy(() => NestedEnumActivitySourceTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumActivitySourceTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumActivitySourceTypeFilterObjectSchema).optional()
}).strict();
export const EnumActivitySourceTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumActivitySourceTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumActivitySourceTypeWithAggregatesFilter>;
export const EnumActivitySourceTypeWithAggregatesFilterObjectZodSchema = makeSchema();
