import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchReviewStatusFilterObjectSchema as NestedEnumWatchReviewStatusFilterObjectSchema } from './NestedEnumWatchReviewStatusFilter.schema'

const nestedenumwatchreviewstatuswithaggregatesfilterSchema = z.object({
  equals: WatchReviewStatusSchema.optional(),
  in: WatchReviewStatusSchema.array().optional(),
  notIn: WatchReviewStatusSchema.array().optional(),
  not: z.union([WatchReviewStatusSchema, z.lazy(() => NestedEnumWatchReviewStatusWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchReviewStatusFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchReviewStatusFilterObjectSchema).optional()
}).strict();
export const NestedEnumWatchReviewStatusWithAggregatesFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchReviewStatusWithAggregatesFilter> = nestedenumwatchreviewstatuswithaggregatesfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchReviewStatusWithAggregatesFilter>;
export const NestedEnumWatchReviewStatusWithAggregatesFilterObjectZodSchema = nestedenumwatchreviewstatuswithaggregatesfilterSchema;
