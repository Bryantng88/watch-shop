import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewActionSchema } from '../enums/WatchReviewAction.schema';
import { NestedEnumWatchReviewActionWithAggregatesFilterObjectSchema as NestedEnumWatchReviewActionWithAggregatesFilterObjectSchema } from './NestedEnumWatchReviewActionWithAggregatesFilter.schema';
import { NestedIntFilterObjectSchema as NestedIntFilterObjectSchema } from './NestedIntFilter.schema';
import { NestedEnumWatchReviewActionFilterObjectSchema as NestedEnumWatchReviewActionFilterObjectSchema } from './NestedEnumWatchReviewActionFilter.schema'

const makeSchema = () => z.object({
  equals: WatchReviewActionSchema.optional(),
  in: WatchReviewActionSchema.array().optional(),
  notIn: WatchReviewActionSchema.array().optional(),
  not: z.union([WatchReviewActionSchema, z.lazy(() => NestedEnumWatchReviewActionWithAggregatesFilterObjectSchema)]).optional(),
  _count: z.lazy(() => NestedIntFilterObjectSchema).optional(),
  _min: z.lazy(() => NestedEnumWatchReviewActionFilterObjectSchema).optional(),
  _max: z.lazy(() => NestedEnumWatchReviewActionFilterObjectSchema).optional()
}).strict();
export const EnumWatchReviewActionWithAggregatesFilterObjectSchema: z.ZodType<Prisma.EnumWatchReviewActionWithAggregatesFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewActionWithAggregatesFilter>;
export const EnumWatchReviewActionWithAggregatesFilterObjectZodSchema = makeSchema();
