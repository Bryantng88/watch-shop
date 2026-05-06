import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema'

const nestedenumwatchreviewstatusfilterSchema = z.object({
  equals: WatchReviewStatusSchema.optional(),
  in: WatchReviewStatusSchema.array().optional(),
  notIn: WatchReviewStatusSchema.array().optional(),
  not: z.union([WatchReviewStatusSchema, z.lazy(() => NestedEnumWatchReviewStatusFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchReviewStatusFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchReviewStatusFilter> = nestedenumwatchreviewstatusfilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchReviewStatusFilter>;
export const NestedEnumWatchReviewStatusFilterObjectZodSchema = nestedenumwatchreviewstatusfilterSchema;
