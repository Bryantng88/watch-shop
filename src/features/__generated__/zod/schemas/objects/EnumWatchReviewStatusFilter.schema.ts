import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewStatusSchema } from '../enums/WatchReviewStatus.schema';
import { NestedEnumWatchReviewStatusFilterObjectSchema as NestedEnumWatchReviewStatusFilterObjectSchema } from './NestedEnumWatchReviewStatusFilter.schema'

const makeSchema = () => z.object({
  equals: WatchReviewStatusSchema.optional(),
  in: WatchReviewStatusSchema.array().optional(),
  notIn: WatchReviewStatusSchema.array().optional(),
  not: z.union([WatchReviewStatusSchema, z.lazy(() => NestedEnumWatchReviewStatusFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchReviewStatusFilterObjectSchema: z.ZodType<Prisma.EnumWatchReviewStatusFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewStatusFilter>;
export const EnumWatchReviewStatusFilterObjectZodSchema = makeSchema();
