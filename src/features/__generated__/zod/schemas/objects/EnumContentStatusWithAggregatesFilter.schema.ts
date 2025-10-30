import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ContentStatusSchema } from '../enums/ContentStatus.schema';
import { NestedEnumContentStatusWithAggregatesFilterObjectSchema as NestedEnumContentStatusWithAggregatesFilterObjectSchema } from './NestedEnumContentStatusWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumContentStatusFilterObjectSchema as NestedEnumContentStatusFilterObjectSchema } from './NestedEnumContentStatusFilter.schema'

const makeSchema = () => z.object({
  equals: ContentStatusSchema.optional(),
  in: ContentStatusSchema.array().optional(),
  notIn: ContentStatusSchema.array().optional(),
  not: z.union([ContentStatusSchema, z.lazy(() => NestedEnumContentStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumContentStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumContentStatusFilterObjectSchema).optional()
}).strict();
export const EnumContentStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumContentStatusWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumContentStatusWithAggregatesFilter>;
export const EnumContentStatusWithAggregatesFilterObjectZodSchema = makeSchema();
