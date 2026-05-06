import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchReviewActionFilterObjectSchema as NestedEnumWatchReviewActionFilterObjectSchema } from './NestedEnumWatchReviewActionFilter.schema'

const nestedenumwatchreviewactionwithaggregatesfilterSchema = z.object({
  equals: WatchReviewActionSchema.optional(),
  in: WatchReviewActionSchema.array().optional(),
  notIn: WatchReviewActionSchema.array().optional(),
  not: z.union([WatchReviewActionSchema, z.lazy(() => NestedEnumWatchReviewActionWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchReviewActionFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchReviewActionFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchReviewActionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchReviewActionWithAggregatesFilter> = nestedenumwatchreviewactionwithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchReviewActionWithAggregatesFilter>;
export const NestedEnumWatchReviewActionWithAggregatesFilterObjectZodSchema = nestedenumwatchreviewactionwithaggregatesfilterSchema;
