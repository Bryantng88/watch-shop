import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { NestedEnumWatchReviewTargetTypeWithAggregatesFilterObjectSchema as NestedEnumWatchReviewTargetTypeWithAggregatesFilterObjectSchema } from './NestedEnumWatchReviewTargetTypeWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchReviewTargetTypeFilterObjectSchema as NestedEnumWatchReviewTargetTypeFilterObjectSchema } from './NestedEnumWatchReviewTargetTypeFilter.schema'

const makeSchema = () => z.object({
  equals: WatchReviewTargetTypeSchema.optional(),
  in: WatchReviewTargetTypeSchema.array().optional(),
  notIn: WatchReviewTargetTypeSchema.array().optional(),
  not: z.union([WatchReviewTargetTypeSchema, z.lazy(() => NestedEnumWatchReviewTargetTypeWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchReviewTargetTypeFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchReviewTargetTypeFilterObjectSchema).optional()
}).strict();
export const EnumWatchReviewTargetTypeWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchReviewTargetTypeWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewTargetTypeWithAggregatesFilter>;
export const EnumWatchReviewTargetTypeWithAggregatesFilterObjectZodSchema = makeSchema();
