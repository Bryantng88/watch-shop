import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema'

const nestedenumwatchreviewstatusnullablefilterSchema = z.object({
  equals: WatchReviewStatusSchema.optional().nullable(),
  in: WatchReviewStatusSchema.array().optional().nullable(),
  notIn: WatchReviewStatusSchema.array().optional().nullable(),
  not: z.union([WatchReviewStatusSchema, z.lazy(() => NestedEnumWatchReviewStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const NestedEnumWatchReviewStatusNullableFilterObjectSchema: z.ZodType<Prisma.NestedEnumWatchReviewStatusNullableFilter> = nestedenumwatchreviewstatusnullablefilterSchema as unknown as z.ZodType<Prisma.NestedEnumWatchReviewStatusNullableFilter>;
export const NestedEnumWatchReviewStatusNullableFilterObjectZodSchema = nestedenumwatchreviewstatusnullablefilterSchema;
