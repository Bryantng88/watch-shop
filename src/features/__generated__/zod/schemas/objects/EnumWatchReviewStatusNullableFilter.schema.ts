import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { NestedEnumWatchReviewStatusNullableFilterObjectSchema as NestedEnumWatchReviewStatusNullableFilterObjectSchema } from './NestedEnumWatchReviewStatusNullableFilter.schema'

const makeSchema = () => z.object({
  equals: WatchReviewStatusSchema.optional().nullable(),
  in: WatchReviewStatusSchema.array().optional().nullable(),
  notIn: WatchReviewStatusSchema.array().optional().nullable(),
  not: z.union([WatchReviewStatusSchema, z.lazy(() => NestedEnumWatchReviewStatusNullableFilterObjectSchema)]).optional().nullable()
}).strict();
export const EnumWatchReviewStatusNullableFilterObjectSchema: z.ZodType<Prisma.EnumWatchReviewStatusNullableFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewStatusNullableFilter>;
export const EnumWatchReviewStatusNullableFilterObjectZodSchema = makeSchema();
