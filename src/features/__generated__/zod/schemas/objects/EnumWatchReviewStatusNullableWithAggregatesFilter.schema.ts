import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { NestedEnumWatchReviewStatusNullableWithAggregatesFilterObjectSchema as NestedEnumWatchReviewStatusNullableWithAggregatesFilterObjectSchema } from './NestedEnumWatchReviewStatusNullableWithAggregatesFilter.schema';
import { NestedIntNullableFilterObjectSchema as NestedIntNullableFilterObjectSchema } from './NestedIntNullableFilter.schema';
import { NestedEnumWatchReviewStatusNullableFilterObjectSchema as NestedEnumWatchReviewStatusNullableFilterObjectSchema } from './NestedEnumWatchReviewStatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchReviewStatusSchema.optional().nullable(),
  in: WatchReviewStatusSchema.array().optional().nullable(),
  notIn: WatchReviewStatusSchema.array().optional().nullable(),
  not: z.union([WatchReviewStatusSchema, z.lazy(() => NestedEnumWatchReviewStatusNullableWithAggregatesFilterObjectSchema)]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchReviewStatusNullableFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchReviewStatusNullableFilterObjectSchema).optional()
}).strict();
export const EnumWatchReviewStatusNullableWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchReviewStatusNullableWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewStatusNullableWithAggregatesFilter>;
export const EnumWatchReviewStatusNullableWithAggregatesFilterObjectZodSchema = makeSchema();
