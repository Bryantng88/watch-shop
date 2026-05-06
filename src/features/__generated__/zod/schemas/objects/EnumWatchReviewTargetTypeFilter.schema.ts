import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WatchReviewTargetTypeSchema } from '../enums/WatchReviewTargetType.schema';
import { NestedEnumWatchReviewTargetTypeFilterObjectSchema as NestedEnumWatchReviewTargetTypeFilterObjectSchema } from './NestedEnumWatchReviewTargetTypeFilter.schema'

const makeSchema = () => z.object({
  equals: WatchReviewTargetTypeSchema.optional(),
  in: WatchReviewTargetTypeSchema.array().optional(),
  notIn: WatchReviewTargetTypeSchema.array().optional(),
  not: z.union([WatchReviewTargetTypeSchema, z.lazy(() => NestedEnumWatchReviewTargetTypeFilterObjectSchema)]).optional()
}).strict();
export const EnumWatchReviewTargetTypeFilterObjectSchema: z.ZodType<Prisma.EnumWatchReviewTargetTypeFilter> = makeSchema() as unknown as z.ZodType<Prisma.EnumWatchReviewTargetTypeFilter>;
export const EnumWatchReviewTargetTypeFilterObjectZodSchema = makeSchema();
