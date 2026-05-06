import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema'

const nestedenumwatchreviewtargettypefilterSchema = z.object({
  equals: WatchReviewTargetTypeSchema.optional(),
  in: WatchReviewTargetTypeSchema.array().optional(),
  notIn: WatchReviewTargetTypeSchema.array().optional(),
  not: z.union([WatchReviewTargetTypeSchema, z.lazy(() => NestedEnumWatchReviewTargetTypeFilterObjectSchema)]).optional()
}).strict();
export const NestedEnumWatchReviewTargetTypeFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchReviewTargetTypeFilter> = nestedenumwatchreviewtargettypefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchReviewTargetTypeFilter>;
export const NestedEnumWatchReviewTargetTypeFilterObjectZodSchema = nestedenumwatchreviewtargettypefilterSchema;
